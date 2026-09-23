export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  area: string;
  deliveryDays: number;
  codAvailable: boolean;
  isServiceable: boolean;
}

export const INDIAN_PINCODES_DATABASE: Record<string, PincodeInfo> = {
  "700023": { pincode: "700023", city: "Kolkata", state: "West Bengal", area: "Hastings / Kidderpore", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "700001": { pincode: "700001", city: "Kolkata", state: "West Bengal", area: "BBD Bagh / Central", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "700091": { pincode: "700091", city: "Kolkata", state: "West Bengal", area: "Salt Lake Sector V", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "110001": { pincode: "110001", city: "New Delhi", state: "Delhi", area: "Connaught Place", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "110020": { pincode: "110020", city: "New Delhi", state: "Delhi", area: "Okhla Industrial Area", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "400001": { pincode: "400001", city: "Mumbai", state: "Maharashtra", area: "Fort / Nariman Point", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "400050": { pincode: "400050", city: "Mumbai", state: "Maharashtra", area: "Bandra West", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "560001": { pincode: "560001", city: "Bengaluru", state: "Karnataka", area: "MG Road / Brigade", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "560100": { pincode: "560100", city: "Bengaluru", state: "Karnataka", area: "Electronic City", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "600001": { pincode: "600001", city: "Chennai", state: "Tamil Nadu", area: "George Town", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "500001": { pincode: "500001", city: "Hyderabad", state: "Telangana", area: "Abids / Koti", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "395003": { pincode: "395003", city: "Surat", state: "Gujarat", area: "Varachha / Textile Market", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "302001": { pincode: "302001", city: "Jaipur", state: "Rajasthan", area: "Pink City / M.I. Road", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "226001": { pincode: "226001", city: "Lucknow", state: "Uttar Pradesh", area: "Hazratganj", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "411001": { pincode: "411001", city: "Pune", state: "Maharashtra", area: "Shivajinagar / Camp", deliveryDays: 2, codAvailable: true, isServiceable: true },
  "800001": { pincode: "800001", city: "Patna", state: "Bihar", area: "Gandhi Maidan / Fraser Rd", deliveryDays: 4, codAvailable: true, isServiceable: true },
  "781001": { pincode: "781001", city: "Guwahati", state: "Assam", area: "Pan Bazaar", deliveryDays: 4, codAvailable: true, isServiceable: true },
  "682001": { pincode: "682001", city: "Kochi", state: "Kerala", area: "Fort Kochi", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "462001": { pincode: "462001", city: "Bhopal", state: "Madhya Pradesh", area: "MP Nagar / City", deliveryDays: 3, codAvailable: true, isServiceable: true },
  "380001": { pincode: "380001", city: "Ahmedabad", state: "Gujarat", area: "Navrangpura / Ashram Rd", deliveryDays: 3, codAvailable: true, isServiceable: true }
};

export function lookupPincode(pincode: string): PincodeInfo {
  const clean = (pincode || "").trim();
  if (INDIAN_PINCODES_DATABASE[clean]) {
    return INDIAN_PINCODES_DATABASE[clean];
  }

  // Fallback for valid 6-digit Indian pincode
  if (/^[1-9][0-9]{5}$/.test(clean)) {
    const firstDigit = clean.charAt(0);
    let state = "India";
    let city = "Standard Zone";
    if (firstDigit === "7") { state = "West Bengal / East India"; city = "Kolkata Hub"; }
    else if (firstDigit === "1") { state = "Delhi / North India"; city = "NCR Hub"; }
    else if (firstDigit === "4") { state = "Maharashtra / West India"; city = "Mumbai Hub"; }
    else if (firstDigit === "5") { state = "Karnataka / Telangana"; city = "Bengaluru Hub"; }
    else if (firstDigit === "6") { state = "Tamil Nadu / Kerala"; city = "Chennai Hub"; }
    else if (firstDigit === "3") { state = "Gujarat / Rajasthan"; city = "Ahmedabad Hub"; }
    else if (firstDigit === "2") { state = "Uttar Pradesh"; city = "Lucknow Hub"; }
    else if (firstDigit === "8") { state = "Bihar / Jharkhand"; city = "Patna Hub"; }

    return {
      pincode: clean,
      city: city,
      state: state,
      area: `PIN ${clean}`,
      deliveryDays: 3,
      codAvailable: true,
      isServiceable: true,
    };
  }

  return {
    pincode: clean,
    city: "Unknown Area",
    state: "Invalid PIN",
    area: "Not Serviceable",
    deliveryDays: 0,
    codAvailable: false,
    isServiceable: false,
  };
}

export function getEstimatedDeliveryDate(deliveryDays: number = 3): string {
  const target = new Date();
  target.setDate(target.getDate() + deliveryDays);
  return target.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
