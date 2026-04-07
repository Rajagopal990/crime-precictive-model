// ═══════════════════════════════════════
// POLICE ACCOUNTS DATABASE
// ═══════════════════════════════════════
export const POLICE_ACCOUNTS = [
  { id:'SP001', name:'S.P. Rajan', role:'Superintendent of Police', badge:'SP', rank:'SP', password:'sp123', station:'District HQ', access:'full' },
  { id:'SI001', name:'R. Murugan', role:'Sub-Inspector', badge:'SI', rank:'SI', password:'si123', station:'Central PS', access:'station' },
  { id:'SI002', name:'K. Priya', role:'Sub-Inspector (Women Cell)', badge:'SI', rank:'SI', password:'si456', station:'Srirangam PS', access:'station' },
  { id:'CO001', name:'A. Selvam', role:'Circle Inspector', badge:'CI', rank:'CI', password:'ci123', station:'Ariyamangalam PS', access:'circle' },
  { id:'HO001', name:'T. Kannan', role:'Head Constable', badge:'HC', rank:'HC', password:'hc123', station:'Woraiyur PS', access:'station' },
];

// ═══════════════════════════════════════
// FIR DATABASE
// ═══════════════════════════════════════
export const DB = [
  {id:"FIR-2024-001",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.7905,lng:78.7047,area:"Srirangam",ps:"Srirangam PS",date:"2024-01-15",time:"22:30",severity:5,victim:"Male",accused:"Known",status:"Under Investigation"},
  {id:"FIR-2024-002",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.8231,lng:78.6831,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-03-22",time:"01:15",severity:5,victim:"Male",accused:"Unknown",status:"Chargesheeted"},
  {id:"FIR-2024-003",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.7652,lng:78.7343,area:"Woraiyur",ps:"Woraiyur PS",date:"2024-06-10",time:"21:00",severity:5,victim:"Female",accused:"Family Member",status:"Arrested"},
  {id:"FIR-2024-004",ipc:"376",act:"IPC",crimeType:"Rape",lat:10.8051,lng:78.6858,area:"Thillai Nagar",ps:"Central PS",date:"2024-02-11",time:"20:00",severity:5,victim:"Female",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-005",ipc:"376",act:"IPC",crimeType:"Rape",lat:10.7762,lng:78.7214,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2024-05-19",time:"23:45",severity:5,victim:"Minor",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-006",ipc:"392",act:"IPC",crimeType:"Robbery",lat:10.7982,lng:78.7203,area:"Chinthamani",ps:"Srirangam PS",date:"2024-01-28",time:"19:30",severity:4,victim:"Male",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-007",ipc:"395",act:"IPC",crimeType:"Dacoity",lat:10.8121,lng:78.6743,area:"Palakarai",ps:"Central PS",date:"2024-04-05",time:"02:00",severity:5,victim:"Shop Owner",accused:"Gang",status:"Arrested"},
  {id:"FIR-2024-008",ipc:"392",act:"IPC",crimeType:"Robbery",lat:10.7845,lng:78.7089,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-07-14",time:"20:15",severity:4,victim:"Female",accused:"Unknown",status:"Chargesheeted"},
  {id:"FIR-2024-009",ipc:"392",act:"IPC",crimeType:"Robbery",lat:10.8198,lng:78.7156,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-08-22",time:"21:30",severity:4,victim:"Male",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-010",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.7934,lng:78.7012,area:"Srirangam",ps:"Srirangam PS",date:"2024-01-05",time:"15:00",severity:2,victim:"Male",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-011",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8067,lng:78.6921,area:"Thillai Nagar",ps:"Central PS",date:"2024-02-18",time:"11:30",severity:2,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-012",ipc:"380",act:"IPC",crimeType:"House Breaking",lat:10.7723,lng:78.7289,area:"Woraiyur",ps:"Woraiyur PS",date:"2024-03-09",time:"03:00",severity:3,victim:"Family",accused:"Unknown",status:"Arrested"},
  {id:"FIR-2024-013",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8234,lng:78.6867,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-04-12",time:"16:45",severity:2,victim:"Male",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-014",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.7891,lng:78.7178,area:"Chinthamani",ps:"Srirangam PS",date:"2024-05-30",time:"14:00",severity:2,victim:"Female",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2024-015",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8012,lng:78.6834,area:"Palakarai",ps:"Central PS",date:"2024-06-25",time:"09:00",severity:2,victim:"Male",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-016",ipc:"354",act:"IPC",crimeType:"Harassment (Women)",lat:10.7967,lng:78.6989,area:"Srirangam",ps:"Srirangam PS",date:"2024-03-17",time:"18:30",severity:3,victim:"Female",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-017",ipc:"509",act:"IPC",crimeType:"Harassment (Women)",lat:10.8089,lng:78.6912,area:"Thillai Nagar",ps:"Central PS",date:"2024-05-22",time:"19:00",severity:3,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-018",ipc:"354",act:"IPC",crimeType:"Harassment (Women)",lat:10.7812,lng:78.7198,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2024-07-08",time:"20:30",severity:3,victim:"Female",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2024-019",ipc:"498A",act:"IPC",crimeType:"Domestic Violence",lat:10.7843,lng:78.7067,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-02-14",time:"22:00",severity:3,victim:"Female",accused:"Husband",status:"Arrested"},
  {id:"FIR-2024-020",ipc:"498A",act:"IPC",crimeType:"Domestic Violence",lat:10.8156,lng:78.6778,area:"Palakarai",ps:"Central PS",date:"2024-04-28",time:"21:15",severity:3,victim:"Female",accused:"In-laws",status:"Under Investigation"},
  {id:"FIR-2024-021",ipc:"498A",act:"IPC",crimeType:"Domestic Violence",lat:10.7923,lng:78.7234,area:"Srirangam",ps:"Srirangam PS",date:"2024-06-18",time:"20:45",severity:3,victim:"Female",accused:"Husband",status:"Arrested"},
  {id:"FIR-2024-022",ipc:"20",act:"NDPS",crimeType:"Drug Trafficking",lat:10.8178,lng:78.7089,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-01-20",time:"11:00",severity:4,victim:"",accused:"Gang",status:"Arrested"},
  {id:"FIR-2024-023",ipc:"21",act:"NDPS",crimeType:"Drug Possession",lat:10.7956,lng:78.6923,area:"Thillai Nagar",ps:"Central PS",date:"2024-03-15",time:"16:30",severity:3,victim:"",accused:"Individual",status:"Chargesheeted"},
  {id:"FIR-2024-024",ipc:"20",act:"NDPS",crimeType:"Drug Trafficking",lat:10.7678,lng:78.7312,area:"Woraiyur",ps:"Woraiyur PS",date:"2024-05-08",time:"23:30",severity:4,victim:"",accused:"Network",status:"Under Investigation"},
  {id:"FIR-2024-025",ipc:"22",act:"NDPS",crimeType:"Drug Trafficking",lat:10.8245,lng:78.6901,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-07-30",time:"14:00",severity:5,victim:"",accused:"Gang",status:"Arrested"},
  {id:"FIR-2024-026",ipc:"25",act:"Arms",crimeType:"Illegal Arms",lat:10.7889,lng:78.7145,area:"Chinthamani",ps:"Srirangam PS",date:"2024-02-27",time:"10:00",severity:4,victim:"",accused:"Individual",status:"Arrested"},
  {id:"FIR-2024-027",ipc:"25",act:"Arms",crimeType:"Illegal Arms",lat:10.8112,lng:78.6798,area:"Palakarai",ps:"Central PS",date:"2024-06-12",time:"08:30",severity:4,victim:"",accused:"Gang",status:"Chargesheeted"},
  {id:"FIR-2024-028",ipc:"420",act:"IPC",crimeType:"Fraud/Cheating",lat:10.8034,lng:78.6945,area:"Thillai Nagar",ps:"Central PS",date:"2024-01-31",time:"12:00",severity:3,victim:"Male",accused:"Known",status:"Under Investigation"},
  {id:"FIR-2024-029",ipc:"420",act:"IPC",crimeType:"Fraud/Cheating",lat:10.7901,lng:78.7034,area:"Srirangam",ps:"Srirangam PS",date:"2024-04-17",time:"14:30",severity:3,victim:"Female",accused:"Online",status:"Chargesheeted"},
  {id:"FIR-2024-030",ipc:"420",act:"IPC",crimeType:"Fraud/Cheating",lat:10.8189,lng:78.7023,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-08-05",time:"11:15",severity:3,victim:"Elderly",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-031",ipc:"363",act:"IPC",crimeType:"Kidnapping",lat:10.7745,lng:78.7256,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2024-03-04",time:"17:00",severity:5,victim:"Minor",accused:"Unknown",status:"Arrested"},
  {id:"FIR-2024-032",ipc:"365",act:"IPC",crimeType:"Kidnapping",lat:10.8067,lng:78.6867,area:"Thillai Nagar",ps:"Central PS",date:"2024-07-19",time:"16:45",severity:5,victim:"Female",accused:"Known",status:"Under Investigation"},
  {id:"FIR-2024-033",ipc:"3",act:"SC/ST",crimeType:"Atrocity (SC/ST)",lat:10.7823,lng:78.7178,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-04-23",time:"13:00",severity:4,victim:"SC Male",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-034",ipc:"3",act:"SC/ST",crimeType:"Atrocity (SC/ST)",lat:10.8145,lng:78.6812,area:"Palakarai",ps:"Central PS",date:"2024-06-29",time:"18:00",severity:4,victim:"SC Family",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2024-035",ipc:"60",act:"Excise",crimeType:"Illicit Liquor",lat:10.7967,lng:78.7089,area:"Chinthamani",ps:"Srirangam PS",date:"2024-02-08",time:"09:00",severity:2,victim:"",accused:"Individual",status:"Arrested"},
  {id:"FIR-2024-036",ipc:"60",act:"Excise",crimeType:"Illicit Liquor",lat:10.8234,lng:78.7134,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-05-14",time:"07:30",severity:2,victim:"",accused:"Gang",status:"Arrested"},
  {id:"FIR-2024-037",ipc:"304B",act:"IPC",crimeType:"Dowry Death",lat:10.7856,lng:78.7023,area:"Srirangam",ps:"Srirangam PS",date:"2024-03-29",time:"06:00",severity:5,victim:"Female",accused:"In-laws",status:"Arrested"},
  {id:"FIR-2024-038",ipc:"307",act:"IPC",crimeType:"Attempt to Murder",lat:10.8089,lng:78.6956,area:"Thillai Nagar",ps:"Central PS",date:"2024-05-05",time:"21:00",severity:5,victim:"Male",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-039",ipc:"324",act:"IPC",crimeType:"Grievous Hurt",lat:10.7912,lng:78.7212,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2024-07-25",time:"20:30",severity:3,victim:"Male",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2024-040",ipc:"307",act:"IPC",crimeType:"Attempt to Murder",lat:10.8167,lng:78.7045,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-09-12",time:"22:15",severity:5,victim:"Male",accused:"Gang",status:"Under Investigation"},
  {id:"FIR-2024-041",ipc:"13",act:"Gambling",crimeType:"Gambling",lat:10.7934,lng:78.6978,area:"Palakarai",ps:"Central PS",date:"2024-06-03",time:"22:00",severity:1,victim:"",accused:"Group",status:"Arrested"},
  {id:"FIR-2024-042",ipc:"13",act:"Gambling",crimeType:"Gambling",lat:10.8023,lng:78.7167,area:"Chinthamani",ps:"Srirangam PS",date:"2024-08-17",time:"21:30",severity:1,victim:"",accused:"Group",status:"Arrested"},
  {id:"ACC-2024-001",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.8134,lng:78.7089,area:"NH-67 Junction",ps:"Traffic PS",date:"2024-01-12",time:"07:30",severity:4,victim:"Multiple",accused:"Driver",status:"Under Investigation"},
  {id:"ACC-2024-002",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.8145,lng:78.7101,area:"NH-67 Junction",ps:"Traffic PS",date:"2024-03-18",time:"08:15",severity:3,victim:"2 Persons",accused:"Driver",status:"Chargesheeted"},
  {id:"ACC-2024-003",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.8156,lng:78.7078,area:"NH-67 Junction",ps:"Traffic PS",date:"2024-05-24",time:"06:45",severity:5,victim:"Fatal",accused:"Driver",status:"Arrested"},
  {id:"ACC-2024-004",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.7823,lng:78.7234,area:"Woraiyur Highway",ps:"Traffic PS",date:"2024-07-11",time:"23:00",severity:4,victim:"2 Persons",accused:"Truck Driver",status:"Chargesheeted"},
  {id:"FIR-2023-101",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.8012,lng:78.7034,area:"Kattur",ps:"Ariyamangalam PS",date:"2023-11-14",time:"23:10",severity:5,victim:"Male",accused:"Unknown",status:"Chargesheeted"},
  {id:"FIR-2023-102",ipc:"376",act:"IPC",crimeType:"Rape",lat:10.7934,lng:78.7145,area:"Chinthamani",ps:"Srirangam PS",date:"2023-09-21",time:"21:30",severity:5,victim:"Female",accused:"Known",status:"Arrested"},
  {id:"FIR-2023-103",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8078,lng:78.6934,area:"Thillai Nagar",ps:"Central PS",date:"2023-08-05",time:"14:20",severity:2,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2023-104",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.7956,lng:78.7089,area:"Srirangam",ps:"Srirangam PS",date:"2023-07-18",time:"16:45",severity:2,victim:"Male",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2023-105",ipc:"392",act:"IPC",crimeType:"Robbery",lat:10.7867,lng:78.7234,area:"Woraiyur",ps:"Woraiyur PS",date:"2023-06-12",time:"20:00",severity:4,victim:"Male",accused:"Unknown",status:"Arrested"},
  {id:"FIR-2023-106",ipc:"498A",act:"IPC",crimeType:"Domestic Violence",lat:10.8134,lng:78.6867,area:"Palakarai",ps:"Central PS",date:"2023-05-28",time:"22:30",severity:3,victim:"Female",accused:"Husband",status:"Arrested"},
  {id:"FIR-2023-107",ipc:"20",act:"NDPS",crimeType:"Drug Trafficking",lat:10.8212,lng:78.7123,area:"Kattur",ps:"Ariyamangalam PS",date:"2023-04-09",time:"01:15",severity:4,victim:"",accused:"Gang",status:"Arrested"},
  {id:"FIR-2023-108",ipc:"420",act:"IPC",crimeType:"Fraud/Cheating",lat:10.8034,lng:78.6956,area:"Thillai Nagar",ps:"Central PS",date:"2023-03-17",time:"11:00",severity:3,victim:"Elderly",accused:"Online",status:"Chargesheeted"},
  {id:"FIR-2023-109",ipc:"307",act:"IPC",crimeType:"Attempt to Murder",lat:10.7889,lng:78.7167,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2023-02-22",time:"21:45",severity:5,victim:"Male",accused:"Known",status:"Arrested"},
  {id:"FIR-2023-110",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.8123,lng:78.7056,area:"NH-67 Junction",ps:"Traffic PS",date:"2023-01-14",time:"06:30",severity:4,victim:"Multiple",accused:"Driver",status:"Chargesheeted"},
  {id:"FIR-2023-111",ipc:"354",act:"IPC",crimeType:"Harassment (Women)",lat:10.8056,lng:78.6923,area:"Thillai Nagar",ps:"Central PS",date:"2023-07-04",time:"19:30",severity:3,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2023-112",ipc:"363",act:"IPC",crimeType:"Kidnapping",lat:10.7923,lng:78.7056,area:"Srirangam",ps:"Srirangam PS",date:"2023-08-19",time:"15:00",severity:5,victim:"Minor",accused:"Unknown",status:"Arrested"},
  {id:"FIR-2023-113",ipc:"380",act:"IPC",crimeType:"House Breaking",lat:10.7734,lng:78.7267,area:"Woraiyur",ps:"Woraiyur PS",date:"2023-09-03",time:"02:30",severity:3,victim:"Family",accused:"Unknown",status:"Arrested"},
  {id:"FIR-2023-114",ipc:"3",act:"SC/ST",crimeType:"Atrocity (SC/ST)",lat:10.7867,lng:78.7134,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2023-10-11",time:"12:00",severity:4,victim:"SC Family",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2023-115",ipc:"25",act:"Arms",crimeType:"Illegal Arms",lat:10.8167,lng:78.6934,area:"Palakarai",ps:"Central PS",date:"2023-11-25",time:"09:30",severity:4,victim:"",accused:"Gang",status:"Arrested"},
  {id:"FIR-2023-116",ipc:"21",act:"NDPS",crimeType:"Drug Possession",lat:10.7978,lng:78.6978,area:"Srirangam",ps:"Srirangam PS",date:"2023-12-07",time:"17:00",severity:3,victim:"",accused:"Individual",status:"Arrested"},
  {id:"FIR-2023-117",ipc:"60",act:"Excise",crimeType:"Illicit Liquor",lat:10.8189,lng:78.7012,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2023-06-30",time:"08:00",severity:2,victim:"",accused:"Group",status:"Arrested"},
  {id:"FIR-2023-118",ipc:"304B",act:"IPC",crimeType:"Dowry Death",lat:10.8078,lng:78.6845,area:"Palakarai",ps:"Central PS",date:"2023-05-15",time:"07:00",severity:5,victim:"Female",accused:"In-laws",status:"Arrested"},
  {id:"FIR-2023-119",ipc:"13",act:"Gambling",crimeType:"Gambling",lat:10.7912,lng:78.7056,area:"Chinthamani",ps:"Srirangam PS",date:"2023-04-22",time:"21:00",severity:1,victim:"",accused:"Group",status:"Arrested"},
  {id:"FIR-2023-120",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8156,lng:78.7089,area:"Kattur",ps:"Ariyamangalam PS",date:"2023-03-08",time:"13:30",severity:2,victim:"Male",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-201",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.7945,lng:78.6978,area:"Srirangam",ps:"Srirangam PS",date:"2024-10-05",time:"00:30",severity:5,victim:"Male",accused:"Gang",status:"Arrested"},
  {id:"FIR-2024-202",ipc:"392",act:"IPC",crimeType:"Robbery",lat:10.8023,lng:78.7056,area:"Chinthamani",ps:"Srirangam PS",date:"2024-10-18",time:"21:00",severity:4,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-203",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8112,lng:78.6912,area:"Thillai Nagar",ps:"Central PS",date:"2024-10-25",time:"10:30",severity:2,victim:"Male",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2024-204",ipc:"498A",act:"IPC",crimeType:"Domestic Violence",lat:10.7834,lng:78.7112,area:"Woraiyur",ps:"Woraiyur PS",date:"2024-11-02",time:"23:00",severity:3,victim:"Female",accused:"Husband",status:"Arrested"},
  {id:"FIR-2024-205",ipc:"20",act:"NDPS",crimeType:"Drug Trafficking",lat:10.8234,lng:78.7056,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-11-09",time:"02:00",severity:4,victim:"",accused:"Network",status:"Under Investigation"},
  {id:"FIR-2024-206",ipc:"354",act:"IPC",crimeType:"Harassment (Women)",lat:10.7967,lng:78.7034,area:"Srirangam",ps:"Srirangam PS",date:"2024-11-15",time:"18:45",severity:3,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-207",ipc:"307",act:"IPC",crimeType:"Attempt to Murder",lat:10.8145,lng:78.7012,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-11-22",time:"22:00",severity:5,victim:"Male",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-208",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.8167,lng:78.7067,area:"NH-67 Junction",ps:"Traffic PS",date:"2024-11-28",time:"05:45",severity:5,victim:"Fatal",accused:"Truck Driver",status:"Arrested"},
  {id:"FIR-2024-209",ipc:"420",act:"IPC",crimeType:"Fraud/Cheating",lat:10.7956,lng:78.6967,area:"Thillai Nagar",ps:"Central PS",date:"2024-12-03",time:"14:00",severity:3,victim:"Multiple",accused:"Gang",status:"Under Investigation"},
  {id:"FIR-2024-210",ipc:"380",act:"IPC",crimeType:"House Breaking",lat:10.8067,lng:78.7089,area:"Chinthamani",ps:"Srirangam PS",date:"2024-12-10",time:"03:15",severity:3,victim:"Family",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-211",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8023,lng:78.6912,area:"Thillai Nagar",ps:"Central PS",date:"2024-09-14",time:"12:00",severity:2,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-212",ipc:"509",act:"IPC",crimeType:"Harassment (Women)",lat:10.7845,lng:78.7156,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2024-09-27",time:"20:15",severity:3,victim:"Female",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2024-213",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.8178,lng:78.7023,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-10-08",time:"20:00",severity:5,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-214",ipc:"3",act:"SC/ST",crimeType:"Atrocity (SC/ST)",lat:10.8056,lng:78.6878,area:"Palakarai",ps:"Central PS",date:"2024-09-19",time:"11:30",severity:4,victim:"SC Male",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-215",ipc:"25",act:"Arms",crimeType:"Illegal Arms",lat:10.7934,lng:78.7089,area:"Srirangam",ps:"Srirangam PS",date:"2024-08-30",time:"10:00",severity:4,victim:"",accused:"Individual",status:"Chargesheeted"},
  {id:"FIR-2024-216",ipc:"363",act:"IPC",crimeType:"Kidnapping",lat:10.8089,lng:78.7145,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-08-14",time:"17:30",severity:5,victim:"Minor",accused:"Gang",status:"Arrested"},
  {id:"FIR-2024-217",ipc:"22",act:"NDPS",crimeType:"Drug Trafficking",lat:10.7712,lng:78.7289,area:"Woraiyur",ps:"Woraiyur PS",date:"2024-07-29",time:"23:45",severity:5,victim:"",accused:"Gang",status:"Under Investigation"},
  {id:"FIR-2024-218",ipc:"304B",act:"IPC",crimeType:"Dowry Death",lat:10.8145,lng:78.7056,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-07-12",time:"06:30",severity:5,victim:"Female",accused:"Husband",status:"Arrested"},
  {id:"FIR-2024-219",ipc:"60",act:"Excise",crimeType:"Illicit Liquor",lat:10.7923,lng:78.7156,area:"Chinthamani",ps:"Srirangam PS",date:"2024-06-28",time:"07:00",severity:2,victim:"",accused:"Individual",status:"Arrested"},
  {id:"FIR-2024-220",ipc:"324",act:"IPC",crimeType:"Grievous Hurt",lat:10.8034,lng:78.6978,area:"Thillai Nagar",ps:"Central PS",date:"2024-06-15",time:"22:30",severity:3,victim:"Male",accused:"Known",status:"Chargesheeted"},
  {id:"FIR-2024-221",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.7878,lng:78.7023,area:"Srirangam",ps:"Srirangam PS",date:"2024-05-25",time:"15:45",severity:2,victim:"Elderly",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2024-222",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.7845,lng:78.7245,area:"Woraiyur Highway",ps:"Traffic PS",date:"2024-05-11",time:"22:15",severity:3,victim:"2 Persons",accused:"Driver",status:"Chargesheeted"},
  {id:"FIR-2024-223",ipc:"13",act:"Gambling",crimeType:"Gambling",lat:10.8112,lng:78.6956,area:"Palakarai",ps:"Central PS",date:"2024-04-26",time:"20:30",severity:1,victim:"",accused:"Group",status:"Arrested"},
  {id:"FIR-2024-224",ipc:"498A",act:"IPC",crimeType:"Domestic Violence",lat:10.8167,lng:78.7089,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-04-13",time:"21:00",severity:3,victim:"Female",accused:"Husband",status:"Under Investigation"},
  {id:"FIR-2024-225",ipc:"395",act:"IPC",crimeType:"Dacoity",lat:10.7956,lng:78.7012,area:"Srirangam",ps:"Srirangam PS",date:"2024-03-30",time:"01:30",severity:5,victim:"Shop Owner",accused:"Gang",status:"Arrested"},
  {id:"FIR-2024-226",ipc:"420",act:"IPC",crimeType:"Fraud/Cheating",lat:10.7823,lng:78.7189,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2024-03-16",time:"13:00",severity:3,victim:"Male",accused:"Online",status:"Under Investigation"},
  {id:"FIR-2024-227",ipc:"354",act:"IPC",crimeType:"Harassment (Women)",lat:10.8234,lng:78.6923,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2024-03-01",time:"19:00",severity:3,victim:"Female",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-228",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.8089,lng:78.7178,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2024-02-14",time:"23:30",severity:5,victim:"Male",accused:"Known",status:"Arrested"},
  {id:"FIR-2024-229",ipc:"392",act:"IPC",crimeType:"Robbery",lat:10.8023,lng:78.6956,area:"Thillai Nagar",ps:"Central PS",date:"2024-02-01",time:"20:45",severity:4,victim:"Female",accused:"Unknown",status:"Chargesheeted"},
  {id:"FIR-2024-230",ipc:"376",act:"IPC",crimeType:"Rape",lat:10.8145,lng:78.7123,area:"Kattur",ps:"Ariyamangalam PS",date:"2024-01-20",time:"22:00",severity:5,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2025-001",ipc:"302",act:"IPC",crimeType:"Murder",lat:10.7967,lng:78.7023,area:"Srirangam",ps:"Srirangam PS",date:"2025-01-08",time:"21:45",severity:5,victim:"Male",accused:"Known",status:"Arrested"},
  {id:"FIR-2025-002",ipc:"379",act:"IPC",crimeType:"Theft",lat:10.8056,lng:78.6934,area:"Thillai Nagar",ps:"Central PS",date:"2025-01-15",time:"11:30",severity:2,victim:"Female",accused:"Unknown",status:"Under Investigation"},
  {id:"FIR-2025-003",ipc:"20",act:"NDPS",crimeType:"Drug Trafficking",lat:10.8189,lng:78.7078,area:"Ariyamangalam",ps:"Ariyamangalam PS",date:"2025-01-22",time:"02:15",severity:4,victim:"",accused:"Gang",status:"Arrested"},
  {id:"FIR-2025-004",ipc:"498A",act:"IPC",crimeType:"Domestic Violence",lat:10.7845,lng:78.7189,area:"K.K. Nagar",ps:"Woraiyur PS",date:"2025-02-03",time:"22:00",severity:3,victim:"Female",accused:"Husband",status:"Under Investigation"},
  {id:"FIR-2025-005",ipc:"279",act:"IPC",crimeType:"Road Accident",lat:10.8134,lng:78.7067,area:"NH-67 Junction",ps:"Traffic PS",date:"2025-02-10",time:"07:00",severity:4,victim:"2 Persons",accused:"Driver",status:"Chargesheeted"},
];

// ═══════════════════════════════════════
// CRIME CONFIG
// ═══════════════════════════════════════
export const CCFG = {
  "Murder":{c:"#FF0000",i:"💀"},"Rape":{c:"#8B0000",i:"🚨"},
  "Attempt to Murder":{c:"#FF4500",i:"⚔️"},"Dowry Death":{c:"#DC143C",i:"☠️"},
  "Kidnapping":{c:"#FF6347",i:"🔗"},"Dacoity":{c:"#FF8C00",i:"🔫"},
  "Robbery":{c:"#FFA500",i:"👊"},"Drug Trafficking":{c:"#9400D3",i:"💊"},
  "Illegal Arms":{c:"#4B0082",i:"🔫"},"Atrocity (SC/ST)":{c:"#B8860B",i:"⚖️"},
  "Grievous Hurt":{c:"#FF6600",i:"🤕"},"Domestic Violence":{c:"#FF69B4",i:"🏠"},
  "Harassment (Women)":{c:"#FF1493",i:"👩"},"Drug Possession":{c:"#BA55D3",i:"💉"},
  "Fraud/Cheating":{c:"#20B2AA",i:"💰"},"House Breaking":{c:"#CD853F",i:"🏚️"},
  "Theft":{c:"#DAA520",i:"🛍️"},"Illicit Liquor":{c:"#8FBC8F",i:"🍶"},
  "Gambling":{c:"#708090",i:"🎲"},"Road Accident":{c:"#00CED1",i:"🚗"},
};

export const AREA_COORDS = {
  'Srirangam':{lat:10.7934,lng:78.7023},'Chinthamani':{lat:10.7891,lng:78.7089},
  'Thillai Nagar':{lat:10.8067,lng:78.6921},'Palakarai':{lat:10.8045,lng:78.6889},
  'Ariyamangalam':{lat:10.8189,lng:78.7056},'Kattur':{lat:10.8198,lng:78.7089},
  'Woraiyur':{lat:10.7756,lng:78.7223},'K.K. Nagar':{lat:10.7812,lng:78.7198},
  'NH-67 Junction':{lat:10.8145,lng:78.7089},
};

export const PS_LIST = [
  {name:"Central PS",lat:10.8045,lng:78.6889},{name:"Srirangam PS",lat:10.7934,lng:78.7023},
  {name:"Ariyamangalam PS",lat:10.8189,lng:78.7056},{name:"Woraiyur PS",lat:10.7756,lng:78.7223},
  {name:"Traffic PS",lat:10.8012,lng:78.6978},
];

export const PATROL_ROUTES = {
  night:[{lat:10.8045,lng:78.6889},{lat:10.8067,lng:78.6921},{lat:10.7989,lng:78.7045},{lat:10.7934,lng:78.7023},{lat:10.7823,lng:78.7198},{lat:10.8045,lng:78.6889}],
  day:  [{lat:10.8189,lng:78.7056},{lat:10.8145,lng:78.7089},{lat:10.8067,lng:78.6921},{lat:10.8045,lng:78.6889},{lat:10.7934,lng:78.7023},{lat:10.8189,lng:78.7056}],
  women:[{lat:10.8067,lng:78.6921},{lat:10.7967,lng:78.6989},{lat:10.7812,lng:78.7198},{lat:10.7756,lng:78.7223},{lat:10.7934,lng:78.7023},{lat:10.8067,lng:78.6921}],
};

export const ALERTS = [
  '🔴 HIGH ALERT: Robbery near Chinthamani — PCR-02 deployed  ',
  '🟡 Patrol PCR-01 active in Srirangam zone  ',
  '🔴 NDPS case at Ariyamangalam PS  ',
  '🟢 3 arrests — Central PS Theft solved  ',
  '⚠️ NH-67 accident zone — heightened surveillance  ',
  '🔴 Women safety alert — Woraiyur evening patrol  ',
  '🟡 Drug trafficking monitoring — Kattur corridor  ',
  '🟢 Monthly stats updated in CCTNS  ',
  '🤖 AI: Theft risk elevated tonight — deploy extra units  ',
];

export const IPC_REF = [
  {s:'121',d:'Waging war against Govt'},{s:'141',d:'Unlawful Assembly'},{s:'144',d:'Unlawful Assembly (Armed)'},{s:'146',d:'Rioting'},{s:'147',d:'Rioting'},{s:'148',d:'Rioting — deadly weapon'},{s:'151',d:'Assembling to disturb peace'},{s:'153A',d:'Promoting enmity'},{s:'268',d:'Public nuisance'},{s:'295A',d:'Insulting religion'},{s:'302',d:'Murder'},{s:'304B',d:'Dowry Death'},{s:'307',d:'Attempt to Murder'},{s:'322',d:'Grievous hurt'},{s:'324',d:'Hurt by weapon'},{s:'351',d:'Assault'},{s:'354',d:'Assault on woman'},{s:'363',d:'Kidnapping'},{s:'364',d:'Kidnapping for murder'},{s:'365',d:'Wrongful confinement'},{s:'366',d:'Kidnapping for marriage'},{s:'376',d:'Rape'},{s:'379',d:'Theft'},{s:'380',d:'Theft in dwelling'},{s:'383',d:'Extortion'},{s:'390',d:'Robbery'},{s:'391',d:'Dacoity'},{s:'392',d:'Punishment for robbery'},{s:'395',d:'Punishment for dacoity'},{s:'396',d:'Dacoity with murder'},{s:'397',d:'Robbery with deadly weapon'},{s:'411',d:'Receiving stolen property'},{s:'420',d:'Cheating and fraud'},{s:'441',d:'Criminal trespass'},{s:'442',d:'House-trespass'},{s:'447',d:'Criminal trespass punishment'},{s:'448',d:'House-trespass punishment'},{s:'454',d:'Lurking house-trespass for theft'},{s:'457',d:'Lurking house-trespass by night'},{s:'465',d:'Forgery'},{s:'467',d:'Forgery of documents'},{s:'468',d:'Forgery for cheating'},{s:'470',d:'Forged document'},{s:'471',d:'Using forged document'},{s:'489A',d:'Counterfeiting currency'},{s:'498A',d:'Cruelty by husband'},{s:'504',d:'Intentional insult'},{s:'506',d:'Criminal intimidation'},{s:'509',d:'Outraging modesty'},
];

export const PATROL_UNITS = [
  {i:'🚔',n:'PCR-01',l:'Central Zone',a:true,speed:'40 km/h',fuel:82},
  {i:'🚔',n:'PCR-02',l:'Srirangam',   a:true,speed:'0 km/h', fuel:91},
  {i:'🏍️',n:'MTR-01',l:'Woraiyur',    a:true,speed:'28 km/h',fuel:67},
  {i:'👮',n:'WOMEN-01',l:'Hwy Patrol', a:true,speed:'55 km/h',fuel:74},
  {i:'🚁',n:'HWY-01', l:'NH-67',       a:false,speed:'0 km/h',fuel:45},
];
