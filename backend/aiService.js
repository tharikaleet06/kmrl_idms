import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Safely parse raw JSON from Gemini response string.
 */
export function safeJsonParse(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') return null;
  try {
    let cleaned = jsonString.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

/**
 * Normalizes array items removing empty/null elements.
 */
export function normalizeArray(arr) {
  return Array.isArray(arr) ? arr.filter(item => item !== null && item !== undefined && item !== '') : [];
}

/**
 * Normalizes extracted entity arrays.
 */
export function normalizeEntities(entitiesObj) {
  if (!entitiesObj || typeof entitiesObj !== 'object') {
    return { addresses: [], dates: [], contractors: [], amounts: [], regulations: [], projectNames: [], documentNumbers: [] };
  }
  return {
    addresses: normalizeArray(entitiesObj.addresses),
    dates: normalizeArray(entitiesObj.dates),
    contractors: normalizeArray(entitiesObj.contractors),
    amounts: normalizeArray(entitiesObj.amounts),
    regulations: normalizeArray(entitiesObj.regulations),
    projectNames: normalizeArray(entitiesObj.projectNames),
    documentNumbers: normalizeArray(entitiesObj.documentNumbers)
  };
}

/**
 * Computes Cosine Similarity between two N-dimensional numerical vectors.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || !Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecA.length !== vecB.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Main Single-Pass Multimodal Document Intelligence Analysis Function.
 * Performs OCR, classification, summary, open entities, location NER, and metadata extraction in ONE Gemini 2.5 Flash call.
 */
export async function analyzeDocument({ fileData, fileType, fileName, title = '', textHint = '' }) {
  if (!ai) {
    return {
      classificationStatus: 'FAILED',
      classificationError: 'GEMINI_API_KEY environment variable missing.',
      ocrText: textHint || null,
      ocrStatus: textHint ? 'COMPLETED' : 'FAILED',
      department: null,
      fileType: null,
      category: null,
      sensitivity: null,
      confidenceScore: null,
      confidenceStatus: 'UNAVAILABLE',
      summary: textHint ? (textHint.length > 200 ? textHint.substring(0, 200) + '...' : textHint) : null,
      tags: [],
      extractedEntities: { addresses: [], dates: [], contractors: [], amounts: [], regulations: [], projectNames: [], documentNumbers: [] },
      location: { stationName: null, surveyNo: null, village: null, district: null, parsedAddress: null, extractionStatus: 'NO_LOCATION_FOUND' }
    };
  }

  const systemInstructionPrompt = `You are an AI Document Intelligence Engine for a metro rail organization.

Analyze the complete provided document and return ONE valid JSON object.

Extract:
- ocrText: complete readable text from the document
- department: department inferred from content
- fileType: specific document type
- category: broad document category
- sensitivity: Public, Internal, Restricted, or Confidential
- confidenceScore: 0–100
- summary: exactly 2 concise sentences
- tags: important keywords and concepts
- extractedEntities:
  - addresses
  - dates
  - contractors
  - amounts
  - regulations
  - projectNames
  - documentNumbers
- location:
  - stationName
  - surveyNo
  - village
  - district
  - parsedAddress

IMPORTANT RULES:
- Analyze the entire document, not only the first page or beginning.
- Preserve all important text, names, numbers, dates, amounts, survey numbers, document numbers, and technical terms accurately.
- The document may be translated, multilingual, scanned, or contain tables.
- Understand the meaning of the document even when the exact search words are not present.
- Extract meaningful keywords and concepts useful for semantic search.
- Infer department, fileType, and category dynamically. Do not use a fixed list.
- Use only information present in the document.
- Never invent or guess information.
- Return null when information is unavailable.
- Return [] when no values exist.
- confidenceScore must be between 0 and 100.
- Return ONLY valid JSON. No markdown or explanation.

Use exactly this structure:

{
  "ocrText": "",
  "department": null,
  "fileType": null,
  "category": null,
  "sensitivity": null,
  "confidenceScore": 0,
  "summary": "",
  "tags": [],
  "extractedEntities": {
    "addresses": [],
    "dates": [],
    "contractors": [],
    "amounts": [],
    "regulations": [],
    "projectNames": [],
    "documentNumbers": []
  },
  "location": {
    "stationName": null,
    "surveyNo": null,
    "village": null,
    "district": null,
    "parsedAddress": null
  }
}

Document title:
${title || "Not provided"}

Document content:
${textHint ? textHint : "Read and analyze the complete attached document."}
`;

  try {
    const contentsPayload = [];

    // Attach inline binary data if base64 file content is provided
    if (fileData && typeof fileData === 'string' && fileData.includes('base64,')) {
      const base64Content = fileData.split('base64,')[1];
      let mime = 'image/png';
      if (fileType?.includes('pdf') || fileName?.endsWith('.pdf')) mime = 'application/pdf';
      else if (fileType?.includes('jpeg') || fileName?.endsWith('.jpg') || fileName?.endsWith('.jpeg')) mime = 'image/jpeg';

      contentsPayload.push({
        inlineData: {
          data: base64Content,
          mimeType: mime
        }
      });
    }

    contentsPayload.push(systemInstructionPrompt);

    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentsPayload
    });

    const parsed = safeJsonParse(res.text) || {};
    const loc = parsed.location || {};
    const hasLoc = loc.stationName || loc.parsedAddress || loc.surveyNo;
    const extractedOcr = parsed.ocrText || textHint || null;

    return {
      classificationStatus: 'COMPLETED',
      classificationError: null,
      ocrText: extractedOcr,
      ocrStatus: extractedOcr ? 'COMPLETED' : 'FAILED',
      department: parsed.department || null,
      fileType: parsed.fileType || parsed.category || null,
      category: parsed.category || parsed.fileType || null,
      sensitivity: parsed.sensitivity || null,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : null,
      confidenceStatus: typeof parsed.confidenceScore === 'number' ? 'VALID' : 'UNAVAILABLE',
      summary: parsed.summary || null,
      tags: normalizeArray(parsed.tags),
      extractedEntities: normalizeEntities(parsed.extractedEntities),
      location: {
        stationName: loc.stationName || null,
        surveyNo: loc.surveyNo || null,
        village: loc.village || null,
        district: loc.district || null,
        parsedAddress: loc.parsedAddress || null,
        extractionStatus: hasLoc ? 'LOCATION_DETECTED' : 'NO_LOCATION_FOUND'
      }
    };
  } catch (err) {
    console.error('Single-Pass AI Analysis Exception:', err.message);
    return {
      classificationStatus: 'FAILED',
      classificationError: err.message,
      ocrText: textHint || null,
      ocrStatus: textHint ? 'COMPLETED' : 'FAILED',
      department: null,
      fileType: null,
      category: null,
      sensitivity: null,
      confidenceScore: null,
      confidenceStatus: 'UNAVAILABLE',
      summary: textHint ? (textHint.length > 200 ? textHint.substring(0, 200) + '...' : textHint) : null,
      tags: [],
      extractedEntities: { addresses: [], dates: [], contractors: [], amounts: [], regulations: [], projectNames: [], documentNumbers: [] },
      location: { stationName: null, surveyNo: null, village: null, district: null, parsedAddress: null, extractionStatus: 'NO_LOCATION_FOUND' }
    };
  }
}

/**
 * Backward-compatible OCR function wrapper calling analyzeDocument.
 */
export async function performOcr({ fileData, fileType, fileName, textHint }) {
  const result = await analyzeDocument({ fileData, fileType, fileName, textHint });
  return {
    ocrText: result.ocrText,
    ocrStatus: result.ocrStatus,
    error: result.classificationError
  };
}

/**
 * Backward-compatible NLP Classifier wrapper calling analyzeDocument.
 */
export async function classifyNlp(title = '', rawText = '', fileData = '', fileType = '', fileName = '') {
  return await analyzeDocument({ title, textHint: rawText, fileData, fileType, fileName });
}

/**
 * Backward-compatible Address Parser wrapper calling analyzeDocument.
 */
export async function parseAddressNlp(textStr = '') {
  const result = await analyzeDocument({ textHint: textStr });
  return {
    stationName: result.location.stationName,
    surveyNo: result.location.surveyNo,
    village: result.location.village,
    district: result.location.district,
    parsedAddress: result.location.parsedAddress,
    extractionStatus: result.location.extractionStatus
  };
}

/**
 * Generate dimensional vector embedding using text-embedding-004
 */
export async function generateEmbedding(text = '') {
  if (!ai || !text || text.trim().length === 0) {
    return null;
  }

  try {
    const res = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text.substring(0, 4000)
    });

    if (res.embedding && res.embedding.values) {
      return res.embedding.values;
    } else if (res.embeddings && res.embeddings[0] && res.embeddings[0].values) {
      return res.embeddings[0].values;
    }
  } catch (err) {
    console.error('Embedding Generation Error:', err.message);
  }

  return null;
}

/**
 * Perform Dense Vector Semantic Search using text-embedding-004 query vector and Cosine Similarity
 */
export async function executeSemanticSearch(queryStr, documentList) {
  if (!documentList || !Array.isArray(documentList)) return [];

  if (!queryStr || queryStr.trim().length === 0) {
    return documentList.map((doc) => ({
      ...doc,
      relevanceScore: 0,
      cosineSimilarityVal: 0,
      searchType: 'UNFILTERED'
    }));
  }

  const queryVector = await generateEmbedding(queryStr);
  const queryLower = queryStr.toLowerCase().trim();

  // If query embedding fails, use authentic text-keyword relevance scoring (No fake vectors!)
  if (!queryVector) {
    return documentList.map((doc) => {
      let score = 0;
      const titleMatch = doc.title?.toLowerCase().includes(queryLower);
      const summaryMatch = doc.summary?.toLowerCase().includes(queryLower);
      const textMatch = doc.rawText?.toLowerCase().includes(queryLower);

      if (titleMatch) score += 60;
      if (summaryMatch) score += 30;
      if (textMatch) score += 10;

      return {
        ...doc,
        relevanceScore: score,
        cosineSimilarityVal: null,
        searchType: 'KEYWORD_FALLBACK'
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  const results = await Promise.all(
    documentList.map(async (doc) => {
      let docVec = doc.embedding;
      if (!docVec || !Array.isArray(docVec) || docVec.length === 0) {
        const textToEmbed = `${doc.title || ''} ${doc.summary || ''} ${doc.rawText || ''} ${doc.department || ''}`;
        docVec = await generateEmbedding(textToEmbed);
        doc.embedding = docVec;
      }

      if (!docVec) {
        const titleMatch = doc.title?.toLowerCase().includes(queryLower);
        return {
          ...doc,
          relevanceScore: titleMatch ? 50 : 0,
          cosineSimilarityVal: null,
          searchType: 'KEYWORD_FALLBACK'
        };
      }

      const sim = cosineSimilarity(queryVector, docVec);
      let score = Math.round(Math.min(99.8, Math.max(0, sim * 100)));

      // Transparent title boost (documented as exact match boost)
      if (doc.title?.toLowerCase().includes(queryLower)) {
        score = Math.min(100, score + 15);
      }

      return {
        ...doc,
        relevanceScore: score,
        cosineSimilarityVal: +sim.toFixed(4),
        searchType: 'COSINE_SEMANTIC'
      };
    })
  );

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
