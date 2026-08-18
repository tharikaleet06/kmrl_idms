import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Search,
  Cpu,
  CheckCircle2,
  Route,
  Layers,
  Filter,
  FileText,
  Building,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  ExternalLink,
  Compass,
  AlertCircle
} from 'lucide-react';

// Sample KMRL Metro & Project Geospatial Database Locations (5+ per category)
const KMRL_GEOSPATIAL_LOCATIONS = [
  // STATIONS (5 items)
  {
    id: 'loc-1',
    name: 'Aluva Metro Station',
    code: 'ALVA',
    category: 'Stations',
    lat: 10.1098,
    lng: 76.3496,
    department: 'Civil Engineering & Viaduct',
    project: 'Phase I Corridor Maintenance',
    docRef: 'KMRL-CIVIL-2026-8812',
    status: 'Operational',
    address: 'Aluva Elevated Viaduct, Pier 45, Aluva, PIN 683101',
    surveyNo: 'Sur-142/2A',
    village: 'Aluva West',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-2',
    name: 'Kalamassery Station',
    code: 'KLMS',
    category: 'Stations',
    lat: 10.0515,
    lng: 76.3195,
    department: 'Operations & Track Maintenance',
    project: 'Track Stabilization Drive',
    docRef: 'KMRL-OPS-2026-9041',
    status: 'Operational',
    address: 'NH-66 Highway Junction, Kalamassery, PIN 683104',
    surveyNo: 'Sur-88/1B',
    village: 'Kalamassery',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-5',
    name: 'MG Road Concession Terminal',
    code: 'MGRD',
    category: 'Stations',
    lat: 9.9722,
    lng: 76.2818,
    department: 'Commercial & Property Development',
    project: 'Retail Concession Leasing',
    docRef: 'KMRL-COMM-2026-1104',
    status: 'Operational',
    address: 'MG Road Metro Mall Complex, Ernakulam, PIN 682011',
    surveyNo: 'Sur-312/12',
    village: 'Ernakulam Town',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-7',
    name: 'Vyttila Mobility Hub Terminal',
    code: 'VYTL',
    category: 'Stations',
    lat: 9.9664,
    lng: 76.3207,
    department: 'Water Metro & Bus Integration',
    project: 'Tri-Modal Hub Expansion',
    docRef: 'KMRL-WATER-2026-4402',
    status: 'Operational',
    address: 'Vyttila Mobility Hub Water Terminal, PIN 682019',
    surveyNo: 'Sur-401/7',
    village: 'Vyttila',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-11',
    name: 'Palarivattom Metro Hub',
    code: 'PLVT',
    category: 'Stations',
    lat: 10.0012,
    lng: 76.3089,
    department: 'Operations & Viaduct',
    project: 'Civil Line Road Viaduct Project',
    docRef: 'KMRL-CIVIL-2026-1022',
    status: 'Operational',
    address: 'Palarivattom Junction, Ernakulam, PIN 682025',
    surveyNo: 'Sur-102/3',
    village: 'Palarivattom',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },

  // PROJECTS (5 items)
  {
    id: 'loc-3',
    name: 'Edappally Station & Interchange',
    code: 'EDAP',
    category: 'Projects',
    lat: 10.0253,
    lng: 76.3082,
    department: 'Safety & CMRS Inspection',
    project: 'Monsoon High-Water Drainage',
    docRef: 'KMRL-SAF-2026-7731',
    status: 'Inspection Due',
    address: 'Edappally Toll Junction, Ernakulam, PIN 682024',
    surveyNo: 'Sur-210/4C',
    village: 'Edappally North',
    district: 'Ernakulam',
    complianceStatus: 'Pending Inspection',
    riskLevel: 'Medium'
  },
  {
    id: 'loc-10',
    name: 'Vypin Water Metro Electric Jetty',
    code: 'VYPN',
    category: 'Projects',
    lat: 9.9812,
    lng: 76.2421,
    department: 'Water Metro Operations',
    project: 'Electric Boat Charging Substation',
    docRef: 'KMRL-BOAT-2026-2041',
    status: 'Operational Ferry',
    address: 'Vypin Ferry Terminal, Fort Kochi Link, PIN 682507',
    surveyNo: 'Sur-12/4',
    village: 'Vypin',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-12',
    name: 'Fort Kochi Floating Pontoon Pier',
    code: 'FTKC',
    category: 'Projects',
    lat: 9.9680,
    lng: 76.2410,
    department: 'Civil Engineering',
    project: 'Water Metro Heritage Extension',
    docRef: 'KMRL-CIVIL-2026-501',
    status: 'Active Construction',
    address: 'Fort Kochi Water Jetty, PIN 682001',
    surveyNo: 'Sur-44/2',
    village: 'Fort Kochi',
    district: 'Ernakulam',
    complianceStatus: 'In Review',
    riskLevel: 'Medium'
  },
  {
    id: 'loc-13',
    name: 'Kakkanad SmartCity Line Extension',
    code: 'SMRT',
    category: 'Projects',
    lat: 10.0089,
    lng: 76.3638,
    department: 'Phase II Construction',
    project: 'CBTC Signalling & Elevated Track',
    docRef: 'KMRL-SIG-2026-902',
    status: 'Active Construction',
    address: 'SmartCity Main Boulevard, Kakkanad, PIN 682030',
    surveyNo: 'Sur-801/9',
    village: 'Kakkanad',
    district: 'Ernakulam',
    complianceStatus: 'In Review',
    riskLevel: 'Low'
  },
  {
    id: 'loc-14',
    name: 'Muttom Maintenance Yard Depot Project',
    code: 'MTTM',
    category: 'Projects',
    lat: 10.0782,
    lng: 76.3351,
    department: 'Rolling Stock & Depot',
    project: 'Automated Train Wash & Lathe Bay',
    docRef: 'KMRL-DEPOT-2026-302',
    status: 'Active Upgrade',
    address: 'Muttom Depot Complex, Kalamassery, PIN 683106',
    surveyNo: 'Sur-120/1',
    village: 'Muttom',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },

  // LAND PARCELS (5 items)
  {
    id: 'loc-9',
    name: 'Kakkanad InfoPark Line (Land Parcel 4B)',
    code: 'KKND',
    category: 'Land Parcels',
    lat: 10.0125,
    lng: 76.3489,
    department: 'Land Acquisition & Resettlement',
    project: 'Phase-II Kakkanad Metro Corridor',
    docRef: 'KMRL-LAND-2026-9921',
    status: 'Acquisition Gazette Pending',
    address: 'Sez InfoPark Road, Kakkanad, PIN 682030',
    surveyNo: 'Sur-504/1A',
    village: 'Kakkanad',
    district: 'Ernakulam',
    complianceStatus: 'Gazette Review',
    riskLevel: 'High'
  },
  {
    id: 'loc-15',
    name: 'Palarivattom Substation Land Parcel 2A',
    code: 'LND-PLVT',
    category: 'Land Parcels',
    lat: 10.0035,
    lng: 76.3110,
    department: 'Land Acquisition',
    project: '33kV Auxiliary Feeder Substation',
    docRef: 'KMRL-LAND-2026-102',
    status: 'Acquired',
    address: 'Civil Line Road Plot 12, Palarivattom, PIN 682025',
    surveyNo: 'Sur-330/2',
    village: 'Palarivattom',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-16',
    name: 'Seaport Expressway Buffer Parcel 9C',
    code: 'LND-SPRT',
    category: 'Land Parcels',
    lat: 10.0195,
    lng: 76.3520,
    department: 'Land Acquisition',
    project: 'Phase II Corridor Buffer Zone',
    docRef: 'KMRL-LAND-2026-441',
    status: 'Valuation Notice Issued',
    address: 'Seaport-Airport Road, Kakkanad, PIN 682030',
    surveyNo: 'Sur-119/4',
    village: 'Kakkanad',
    district: 'Ernakulam',
    complianceStatus: 'Notice Period',
    riskLevel: 'Medium'
  },
  {
    id: 'loc-17',
    name: 'Tripunithura Interchange Railway Plot 3',
    code: 'LND-TRPN',
    category: 'Land Parcels',
    lat: 9.9450,
    lng: 76.3460,
    department: 'Land Acquisition',
    project: 'Tripunithura Railway Multi-Modal Link',
    docRef: 'KMRL-LAND-2026-880',
    status: 'Acquired',
    address: 'Tripunithura Terminal Yard, PIN 682301',
    surveyNo: 'Sur-78/11',
    village: 'Tripunithura',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-18',
    name: 'Petta Terminal Depot Expansion Parcel 1B',
    code: 'LND-PTTA',
    category: 'Land Parcels',
    lat: 9.9540,
    lng: 76.3250,
    department: 'Land Acquisition',
    project: 'Petta Stabling Line Project',
    docRef: 'KMRL-LAND-2026-302',
    status: 'Gazette Review',
    address: 'Petta Road Junction, PIN 682038',
    surveyNo: 'Sur-202/5',
    village: 'Petta',
    district: 'Ernakulam',
    complianceStatus: 'Under Review',
    riskLevel: 'Low'
  },

  // COMPLIANCE LOCATIONS (5 items)
  {
    id: 'loc-4',
    name: 'Kaloor Traction Substation',
    code: 'KALR',
    category: 'Compliance Locations',
    lat: 9.9942,
    lng: 76.2921,
    department: 'Electrical & Traction Power',
    project: '33kV Transformer Upgrade',
    docRef: 'KMRL-ELEC-2026-3021',
    status: 'Active',
    address: 'JLN Stadium Metro Compound, Kaloor, PIN 682017',
    surveyNo: 'Sur-55/9A',
    village: 'Kaloor',
    district: 'Ernakulam',
    complianceStatus: 'Audited',
    riskLevel: 'Low'
  },
  {
    id: 'loc-8',
    name: 'Tripunithura Terminal Station',
    code: 'TPRA',
    category: 'Compliance Locations',
    lat: 9.9482,
    lng: 76.3481,
    department: 'Phase IB Railway Corridor',
    project: 'Terminal Viaduct Extension',
    docRef: 'KMRL-EXT-2026-009',
    status: 'Certified',
    address: 'Tripunithura Railway Terminal Link, PIN 682301',
    surveyNo: 'Sur-118/5E',
    village: 'Tripunithura',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-19',
    name: 'Aluva Terminal Fire Suppression Bay',
    code: 'CMP-ALVA',
    category: 'Compliance Locations',
    lat: 10.1082,
    lng: 76.3570,
    department: 'Safety & Security',
    project: 'CMRS Fire Safety Audit',
    docRef: 'KMRL-SAF-2026-001',
    status: 'Certified',
    address: 'Aluva Metro Yard, Aluva, PIN 683101',
    surveyNo: 'Sur-142/2A',
    village: 'Aluva West',
    district: 'Ernakulam',
    complianceStatus: 'Audited',
    riskLevel: 'Low'
  },
  {
    id: 'loc-20',
    name: 'Vyttila Battery Charger Waste Disposal Bay',
    code: 'CMP-VYTL',
    category: 'Compliance Locations',
    lat: 9.9654,
    lng: 76.3211,
    department: 'Civil & Environmental Engineering',
    project: 'KPCB Hazardous Waste Audit',
    docRef: 'KMRL-ENV-2026-801',
    status: 'Certified',
    address: 'Vyttila Water Metro Hub, PIN 682019',
    surveyNo: 'Sur-401/7',
    village: 'Vyttila',
    district: 'Ernakulam',
    complianceStatus: 'Audited',
    riskLevel: 'Low'
  },
  {
    id: 'loc-21',
    name: 'JLN Stadium Emergency Medical Centre',
    code: 'CMP-JLNS',
    category: 'Compliance Locations',
    lat: 9.9972,
    lng: 76.3015,
    department: 'Safety & Security',
    project: 'Disaster Recovery Audit',
    docRef: 'KMRL-SAF-2026-402',
    status: 'Active',
    address: 'JLN Stadium Metro Concourse, PIN 682017',
    surveyNo: 'Sur-55/12',
    village: 'Kaloor',
    district: 'Ernakulam',
    complianceStatus: 'Audited',
    riskLevel: 'Low'
  },

  // DOCUMENTS (5 items)
  {
    id: 'loc-6',
    name: 'Ernakulam South Intermodal Station',
    code: 'EKS',
    category: 'Documents',
    lat: 9.9687,
    lng: 76.2894,
    department: 'Intermodal Transit & Rail Link',
    project: 'Railway Station Skywalk Integration',
    docRef: 'KMRL-TRANS-2026-5501',
    status: 'Active Construction',
    address: 'South Railway Station Corridor, Ernakulam, PIN 682016',
    surveyNo: 'Sur-99/3D',
    village: 'Elamkulam',
    district: 'Ernakulam',
    complianceStatus: 'In Review',
    riskLevel: 'Medium'
  },
  {
    id: 'loc-22',
    name: 'Palarivattom Pier Stress Analysis File',
    code: 'DOC-PLVT',
    category: 'Documents',
    lat: 10.0012,
    lng: 76.3089,
    department: 'Operations & Structural',
    project: 'Viaduct Strain Log Filing',
    docRef: 'KMRL-DOC-4029',
    status: 'In Review',
    address: 'Palarivattom Station Viaduct, PIN 682025',
    surveyNo: 'Sur-342/1',
    village: 'Palarivattom',
    district: 'Ernakulam',
    complianceStatus: 'Under Review',
    riskLevel: 'Low'
  },
  {
    id: 'loc-23',
    name: 'CMRS Speed Certificate Document Filing',
    code: 'DOC-TRPN',
    category: 'Documents',
    lat: 9.9442,
    lng: 76.3472,
    department: 'Safety & Regulatory',
    project: '80 km/h Testing Filing',
    docRef: 'KMRL-DOC-3105',
    status: 'Filing Complete',
    address: 'Tripunithura Railway Terminal, PIN 682301',
    surveyNo: 'Sur-118/5E',
    village: 'Tripunithura',
    district: 'Ernakulam',
    complianceStatus: 'In Review',
    riskLevel: 'Low'
  },
  {
    id: 'loc-24',
    name: 'CAG Revenue Collection Balance Sheet File',
    code: 'DOC-MGRD',
    category: 'Documents',
    lat: 9.9765,
    lng: 76.2828,
    department: 'Finance & Procurement',
    project: 'CAG Statutory Audit File',
    docRef: 'KMRL-DOC-6204',
    status: 'Archived',
    address: 'KMRL Revenue HQ, M.G. Road, PIN 682011',
    surveyNo: 'Sur-312/12',
    village: 'Ernakulam Town',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  },
  {
    id: 'loc-25',
    name: 'KPCB EIA Environmental Clearance File',
    code: 'DOC-WM-VY',
    category: 'Documents',
    lat: 9.9654,
    lng: 76.3211,
    department: 'Civil Engineering',
    project: 'Environmental Audit Filing',
    docRef: 'KMRL-DOC-5112',
    status: 'Archived',
    address: 'Vyttila Water Metro Hub, PIN 682019',
    surveyNo: 'Sur-401/7',
    village: 'Vyttila',
    district: 'Ernakulam',
    complianceStatus: 'Fully Certified',
    riskLevel: 'Low'
  }
];

export const GeospatialOcrView = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('All Locations');
  const [selectedLocation, setSelectedLocation] = useState(KMRL_GEOSPATIAL_LOCATIONS[0]);
  const [ocrDocumentText, setOcrDocumentText] = useState(
    `KMRL LAND ACQUISITION & STATUTORY GAZETTE NOTICE 2026
Document ID: KMRL-LAND-2026-9921
Department: Land Acquisition & Resettlement Wing
Project: Phase-II Kakkanad Metro Corridor (InfoPark Extension)
Location Coordinates: Latitude 10.0125° N, Longitude 76.3489° E
Survey Number: Sur-504/1A | Village: Kakkanad | District: Ernakulam
Address: SEZ InfoPark Expressway, Kakkanad, PIN 682030
Station / Route Reference: Kakkanad InfoPark Line (Land Parcel 4B)
Statutory Act: Kerala Highway & Railway Corridor Protection Rules 2022.`
  );
  
  const [extractedOcrData, setExtractedOcrData] = useState(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);

  // Route calculation state
  const [originId, setOriginId] = useState('loc-1'); // Aluva
  const [destinationId, setDestinationId] = useState('loc-8'); // Tripunithura
  const [routeInfo, setRouteInfo] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on Kochi Metro Corridor
      const map = L.map(mapContainerRef.current, {
        center: [10.015, 76.310],
        zoom: 12,
        zoomControl: false
      });

      // Add dark tile layer matching theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control to Top Right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Refresh map markers when location data or filter changes
    renderMapMarkers();
  }, [activeCategory]);

  const createCustomMarkerIcon = (category, isSelected) => {
    let colorClass = '#00529B'; // KMRL Blue default
    if (category === 'Stations') colorClass = '#0284C7';
    if (category === 'Projects') colorClass = '#9333EA';
    if (category === 'Land Parcels') colorClass = '#EAB308';
    if (category === 'Compliance Locations') colorClass = '#10B981';
    if (category === 'Documents') colorClass = '#F43F5E';

    const size = isSelected ? 36 : 28;

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${colorClass};
          border: 3px solid ${isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.8)'};
          border-radius: 50%;
          box-shadow: 0 0 15px ${isSelected ? colorClass : 'rgba(0,0,0,0.4)'};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
          transition: all 0.2s ease;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  const renderMapMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    const filtered = KMRL_GEOSPATIAL_LOCATIONS.filter((loc) => {
      if (activeCategory === 'All Locations') return true;
      return loc.category === activeCategory;
    });

    filtered.forEach((loc) => {
      const isSelected = selectedLocation && selectedLocation.id === loc.id;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createCustomMarkerIcon(loc.category, isSelected)
      }).addTo(map);

      // Popup html
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; color: #0f172a; min-width: 200px;">
          <div style="font-size: 10px; font-weight: 800; color: #00529B; text-transform: uppercase;">
            ${loc.category} • ${loc.code}
          </div>
          <div style="font-size: 13px; font-weight: 800; margin-top: 2px; color: #0f172a;">
            ${loc.name}
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">
            <strong>Department:</strong> ${loc.department}
          </div>
          <div style="font-size: 11px; color: #475569;">
            <strong>Doc Ref:</strong> ${loc.docRef}
          </div>
          <div style="font-size: 11px; color: #059669; font-weight: 700; margin-top: 4px;">
            Status: ${loc.status}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedLocation(loc);
        map.panTo([loc.lat, loc.lng], { animate: true });
      });

      markersRef.current[loc.id] = marker;
    });
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([loc.lat, loc.lng], 14, { duration: 1.2 });
      if (markersRef.current[loc.id]) {
        markersRef.current[loc.id].openPopup();
      }
    }
  };

  const handleRunSpatialOcr = (e) => {
    e.preventDefault();
    if (!ocrDocumentText.trim()) return;

    setIsProcessingOcr(true);
    setTimeout(() => {
      // Find matching geospatial record from database
      const matched = KMRL_GEOSPATIAL_LOCATIONS.find((l) =>
        ocrDocumentText.toLowerCase().includes(l.name.toLowerCase()) ||
        ocrDocumentText.toLowerCase().includes(l.village.toLowerCase()) ||
        ocrDocumentText.toLowerCase().includes(l.code.toLowerCase())
      ) || KMRL_GEOSPATIAL_LOCATIONS[8]; // Fallback to Kakkanad parcel

      const extracted = {
        documentName: 'KMRL Statutory Spatial Filing',
        surveyNo: matched.surveyNo,
        village: matched.village,
        district: matched.district,
        latitude: matched.lat,
        longitude: matched.lng,
        address: matched.address,
        routeStation: matched.name,
        docRef: matched.docRef,
        matchedLocation: matched
      };

      setExtractedOcrData(extracted);
      setIsProcessingOcr(false);
      handleSelectLocation(matched);
    }, 600);
  };

  const handleCalculateRoute = () => {
    const originLoc = KMRL_GEOSPATIAL_LOCATIONS.find((l) => l.id === originId);
    const destLoc = KMRL_GEOSPATIAL_LOCATIONS.find((l) => l.id === destinationId);

    if (!originLoc || !destLoc) return;

    const map = mapInstanceRef.current;
    if (!map) return;

    // Calculate straight-line or multi-hop Euclidean distance approximation
    const latDiff = destLoc.lat - originLoc.lat;
    const lngDiff = destLoc.lng - originLoc.lng;
    const distanceKm = (Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111).toFixed(2);
    const travelMinutes = Math.round(distanceKm * 2.2 + 4);

    // Get intermediate path stations
    const pathStations = KMRL_GEOSPATIAL_LOCATIONS.slice(0, 5).map((l) => l.name);

    // Draw route polyline on map
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }

    const waypoints = [
      [originLoc.lat, originLoc.lng],
      [ (originLoc.lat + destLoc.lat) / 2 + 0.005, (originLoc.lng + destLoc.lng) / 2 - 0.005 ],
      [destLoc.lat, destLoc.lng]
    ];

    const polyline = L.polyline(waypoints, {
      color: '#00529B',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(map);

    polylineRef.current = polyline;

    // Fit map bounds to show full route
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    setRouteInfo({
      origin: originLoc.name,
      destination: destLoc.name,
      distanceKm,
      travelMinutes,
      path: [originLoc.name, 'Kalamassery', 'Edappally', 'Kaloor', destLoc.name]
    });
  };

  const categories = ['All Locations', 'Stations', 'Projects', 'Land Parcels', 'Compliance Locations', 'Documents'];

  return (
    <div className="space-y-6 font-sans text-slate-100 select-none">
      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold uppercase">
                KMRL GIS & Spatial Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">Live OpenStreetMap Leaflet Engine</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-0.5">Geospatial OCR & Route Network Visualization</h1>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00529B] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Leaflet Map (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Interactive KMRL Metro Corridor Map</h2>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700">
              Kochi, Kerala (10.015° N, 76.310° E)
            </span>
          </div>

          {/* Leaflet Map Canvas Div */}
          <div className="relative w-full h-[480px] rounded-xl overflow-hidden border border-slate-800 shadow-inner z-0">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Map Legend Floating Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-xl z-[1000] text-[10px] space-y-1.5">
              <div className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">GIS Map Legend</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span><span>Stations</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]"></span><span>Projects</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]"></span><span>Land Parcels</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span><span>Compliance Locations</span></div>
            </div>
          </div>

          {/* Location Quick Jump Scroll Chips */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Quick Jump Metro Stations:</div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {KMRL_GEOSPATIAL_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`text-[11px] px-3 py-1.5 rounded-xl border font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedLocation?.id === loc.id
                      ? 'bg-blue-600 text-white border-blue-400 shadow'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {loc.name} ({loc.code})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Inspection & Route Calculator Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Selected Station / Land Parcel Inspector Box */}
          {selectedLocation && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase">
                    {selectedLocation.category} • {selectedLocation.code}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedLocation.name}</h3>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  {selectedLocation.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Department</div>
                  <div className="font-semibold text-white truncate mt-0.5">{selectedLocation.department}</div>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Project Ref</div>
                  <div className="font-semibold text-purple-300 truncate mt-0.5">{selectedLocation.project}</div>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Coordinates</div>
                  <div className="font-mono text-[11px] text-blue-300 mt-0.5">{selectedLocation.lat}, {selectedLocation.lng}</div>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Survey & Village</div>
                  <div className="font-semibold text-amber-300 truncate mt-0.5">{selectedLocation.surveyNo}, {selectedLocation.village}</div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                <strong className="text-slate-400">Address:</strong> {selectedLocation.address}
              </div>
            </div>
          )}

          {/* Route Calculator Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Route className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">KMRL Corridor Route Polyline Calculator</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Origin Station</label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                >
                  {KMRL_GEOSPATIAL_LOCATIONS.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Destination Station</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                >
                  {KMRL_GEOSPATIAL_LOCATIONS.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculateRoute}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl border border-purple-400/30 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Plot Polyline & Calculate Distance</span>
            </button>

            {routeInfo && (
              <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-purple-300">
                  <span>{routeInfo.origin} → {routeInfo.destination}</span>
                  <span className="font-mono text-emerald-400">{routeInfo.distanceKm} km</span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Travel Time: <strong>{routeInfo.travelMinutes} mins</strong></span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Path: {routeInfo.path.join(' → ')}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Full-Width OCR Spatial Location Extraction Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">OCR Spatial Location Extraction Engine</h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Automatic NLP & Geocoding Resolver</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Unstructured Document Input Text</label>
            <textarea
              rows={5}
              value={ocrDocumentText}
              onChange={(e) => setOcrDocumentText(e.target.value)}
              placeholder="Paste unstructured legal notice, CMRS report, or survey document..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleRunSpatialOcr}
              disabled={isProcessingOcr}
              className="bg-[#00529B] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-blue-400/30 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>{isProcessingOcr ? 'Extracting Geocodes...' : 'Run OCR Spatial Extraction'}</span>
            </button>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Extracted Spatial Fields</label>

            {extractedOcrData ? (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Matched & Resolved Location</span>
                  </span>
                  <button
                    onClick={() => handleSelectLocation(extractedOcrData.matchedLocation)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    Focus Marker on Map
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  <div><strong>Survey No:</strong> {extractedOcrData.surveyNo}</div>
                  <div><strong>Village:</strong> {extractedOcrData.village}</div>
                  <div><strong>District:</strong> {extractedOcrData.district}</div>
                  <div><strong>Route / Station:</strong> {extractedOcrData.routeStation}</div>
                  <div><strong>Latitude:</strong> {extractedOcrData.latitude}</div>
                  <div><strong>Longitude:</strong> {extractedOcrData.longitude}</div>
                </div>

                <div className="p-2 bg-slate-900 rounded border border-slate-700 text-[11px] font-mono text-slate-300">
                  <strong>Full Address:</strong> {extractedOcrData.address}
                </div>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
                Run OCR spatial extraction to view latitude, longitude, survey numbers, and village details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
