// src/utils/mockData.ts
export const mockAgencies = [
    {
      id: "USDA",
      name: "Department of Agriculture",
      titles: ["7", "9"]
    },
    {
      id: "DOC",
      name: "Department of Commerce",
      titles: ["15", "19"]
    },
    {
      id: "DOD",
      name: "Department of Defense",
      titles: ["32", "33"]
    },
    {
      id: "ED",
      name: "Department of Education",
      titles: ["34"]
    }
  ];
  
  export const mockCorrections = [
    {
      date: "2024-02-20",
      titleNumber: "7",
      description: "Updated agricultural guidelines",
      impact: "minor"
    },
    {
      date: "2024-02-19",
      titleNumber: "15",
      description: "Revised commerce regulations",
      impact: "major"
    }
  ];
  
  export const mockTitleContent = {
    "7": "... lengthy XML content ...",
    "15": "... lengthy XML content ...",
    "32": "... lengthy XML content ...",
    "34": "... lengthy XML content ..."
  };