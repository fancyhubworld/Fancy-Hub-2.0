import {
  hashPassword,
  verifyPassword,
  generateJwtToken,
  verifyJwtToken,
  normalizeIndianPhoneNumber,
  generatePhoneOtp,
  verifyPhoneOtp,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  hasPermission,
} from "../src/lib/auth-engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runAuthTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — PHASE 4: AUTH & RBAC MULTI-ROLE TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. PASSWORD HASHING & SALT INTEGRITY
    // -----------------------------------------------------------------------
    console.log("--- 1. PASSWORD HASHING & SALT INTEGRITY ---");
    const rawPass = "FancySecurity@2026";
    const hashed = hashPassword(rawPass);
    assert(hashed.includes(":"), "Generated salted hash formatted as salt:hash");
    assert(verifyPassword(rawPass, hashed) === true, "Password matches cryptographic hash");
    assert(verifyPassword("WrongPassword", hashed) === false, "Rejected incorrect password attempt");

    // -----------------------------------------------------------------------
    // 2. JWT SESSION ISSUANCE & VERIFICATION
    // -----------------------------------------------------------------------
    console.log("\n--- 2. JWT SESSION ISSUANCE & VERIFICATION ---");
    const userPayload = {
      userId: "usr-rahul-1",
      email: "rahul@fancyhub.in",
      name: "Rahul Sharma",
      role: "CUSTOMER" as const,
    };
    const jwtToken = generateJwtToken(userPayload, 24);
    assert(jwtToken.split(".").length === 3, "Generated valid 3-part JWT session token");

    const decoded = verifyJwtToken(jwtToken);
    assert(decoded !== null, "JWT token successfully verified and decoded");
    assert(decoded?.userId === userPayload.userId, "Decoded claims match userId");
    assert(decoded?.role === "CUSTOMER", "Decoded claims match role");

    // Tampered token test
    const tampered = jwtToken.slice(0, -5) + "aaaaa";
    assert(verifyJwtToken(tampered) === null, "Rejected tampered signature token");

    // -----------------------------------------------------------------------
    // 3. INDIAN PHONE NUMBER NORMALIZATION & OTP ENGINE
    // -----------------------------------------------------------------------
    console.log("\n--- 3. INDIAN PHONE NUMBER NORMALIZATION & OTP ENGINE ---");
    assert(normalizeIndianPhoneNumber("9876543210") === "+919876543210", "Normalized 10-digit number to +91");
    assert(normalizeIndianPhoneNumber("09876543210") === "+919876543210", "Normalized leading-zero number to +91");

    const phone = "+919876543210";
    const { otp, expiresAt } = generatePhoneOtp(phone);
    assert(otp.length === 6, `Generated 6-digit OTP (${otp})`);
    assert(expiresAt.getTime() > Date.now(), "OTP expires in the future (3-min TTL)");

    assert(verifyPhoneOtp(phone, otp) === true, "Verified correct OTP");
    assert(verifyPhoneOtp(phone, otp) === false, "OTP consumed single-use (replay blocked)");

    // -----------------------------------------------------------------------
    // 4. PASSWORD RESET TOKEN LIFECYCLE
    // -----------------------------------------------------------------------
    console.log("\n--- 4. PASSWORD RESET TOKEN LIFECYCLE ---");
    const testEmail = "shopper@fancyhub.in";
    const resetToken = generatePasswordResetToken(testEmail);
    assert(resetToken.length === 64, "Generated 64-char secure cryptographic reset token");

    assert(verifyPasswordResetToken(testEmail, resetToken) === true, "Verified valid reset token");
    assert(verifyPasswordResetToken(testEmail, resetToken) === false, "Reset token consumed single-use");

    // -----------------------------------------------------------------------
    // 5. ROLE-BASED ACCESS CONTROL (RBAC) PERMISSIONS
    // -----------------------------------------------------------------------
    console.log("\n--- 5. ROLE-BASED ACCESS CONTROL (RBAC) PERMISSIONS ---");
    assert(hasPermission("SUPER_ADMIN", "ADMIN") === true, "Super Admin has Admin permissions");
    assert(hasPermission("SUPER_ADMIN", "VENDOR") === true, "Super Admin has Vendor permissions");
    assert(hasPermission("ADMIN", "CUSTOMER") === true, "Admin has Customer permissions");
    assert(hasPermission("VENDOR", "VENDOR_STAFF") === true, "Vendor has Vendor Staff permissions");
    assert(hasPermission("CUSTOMER", "ADMIN") === false, "Customer blocked from Admin access");
    assert(hasPermission("CUSTOMER", "VENDOR") === false, "Customer blocked from Vendor access");

    console.log("\n=======================================================================");
    console.log(`Auth & RBAC Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runAuthTests();
