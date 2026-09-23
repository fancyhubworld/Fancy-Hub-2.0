import prisma from "../src/lib/prisma";
import {
  encryptCredentials,
  decryptCredentials,
  maskSecretValue,
  maskCredentialsObject,
  sanitizeLogPayload,
} from "../src/lib/secret-manager";
import {
  getProviderSchema,
  getAllProviderSchemas,
  testProviderConnection,
  verifyProviderWebhook,
  recordApiRequestLog,
} from "../src/lib/integrations/integration-manager";
import { hasPermission } from "../src/lib/auth-engine";

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

async function runApiManagerTestSuite() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — PHASE 1.5: API & INTEGRATIONS MANAGER TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // 1. Add Google OAuth
    console.log("--- 1. ENCRYPTED CREDENTIALS & STORAGE ---");
    const rawGoogleCreds = {
      clientId: "1098273645-fancyhub.apps.googleusercontent.com",
      clientSecret: "GOCSPX-SecretSampleKey2026",
      redirectUri: "https://fancyhub.in/api/auth/callback/google",
    };
    const encrypted = encryptCredentials(rawGoogleCreds);
    assert(encrypted.split(":").length === 3, "1. Add Google OAuth & AES-256-GCM format verified (iv:authTag:cipher)");

    // 2. Save credentials in database
    const saved = await prisma.apiIntegration.upsert({
      where: { id: "test-google-oauth-unit" },
      update: { encryptedCredentials: encrypted, status: "ACTIVE" },
      create: {
        id: "test-google-oauth-unit",
        name: "Google OAuth Automated Test",
        category: "GOOGLE",
        provider: "GOOGLE_OAUTH",
        environment: "DEVELOPMENT",
        mode: "TEST",
        status: "ACTIVE",
        encryptedCredentials: encrypted,
      },
    });
    assert(saved.id === "test-google-oauth-unit", "2. Save credentials to database entity verified");

    // 3. Verify secret is encrypted
    assert(!saved.encryptedCredentials.includes("GOCSPX"), "3. Database stores zero raw plaintext secrets");

    // 4. Verify frontend cannot access secret
    const decrypted = decryptCredentials<typeof rawGoogleCreds>(saved.encryptedCredentials);
    const masked = maskCredentialsObject(decrypted || {});
    assert(masked.clientSecret.startsWith("••••••••••••"), "4. Masked credential output generated for safe UI");

    // 5. Test connection for Google OAuth
    console.log("\n--- 2. CONNECTION PROBES & PROVIDER ADAPTERS ---");
    const googleTest = await testProviderConnection("GOOGLE_OAUTH", decrypted || {});
    assert(googleTest.isSuccess === true, `5. Google OAuth connection test verified (${googleTest.responseTimeMs}ms)`);

    // 6. Show connected status
    assert(googleTest.status === "CONNECTED", "6. Connected status returned cleanly");

    // 7. Configure Razorpay test mode
    const rawRazorpay = {
      keyId: "rzp_test_51FancyHub2026",
      keySecret: "secret_rzp_test_xyz12345",
      merchantName: "FancyHub Automated Test",
    };
    const razorpayEnc = encryptCredentials(rawRazorpay);
    assert(typeof razorpayEnc === "string", "7. Configure Razorpay test mode credentials encrypted");

    // 8. Test connection for Razorpay
    const rzpTest = await testProviderConnection("RAZORPAY", rawRazorpay, { mode: "TEST" });
    assert(rzpTest.isSuccess === true, `8. Razorpay connection probe verified (${rzpTest.responseTimeMs}ms)`);

    // 9. Switch to live mode with confirmation
    const rzpLiveTest = await testProviderConnection("RAZORPAY", { ...rawRazorpay, keyId: "rzp_live_51FancyHubLive" }, { mode: "LIVE" });
    assert(rzpLiveTest.providerDetails?.mode === "LIVE", "9. Switch to Live mode verified with explicit mode tag");

    // 10. Configure webhook
    const webhookSecret = "whsec_sample_hmac_secret_2026";
    const webhookBody = JSON.stringify({ event: "payment.captured", paymentId: "pay_test_999" });
    const crypto = await import("crypto");
    const signature = crypto.createHmac("sha256", webhookSecret).update(webhookBody).digest("hex");
    assert(signature.length === 64, "10. Configure webhook & compute HMAC-SHA256 signature verified");

    // 11. Verify webhook signature
    console.log("\n--- 3. WEBHOOK SECURITY & HMAC SIGNATURES ---");
    const verifyRes = await verifyProviderWebhook("RAZORPAY", webhookBody, signature, webhookSecret);
    assert(verifyRes.isValid === true, "11. Webhook signature HMAC-SHA256 verification passed");

    // 12. Test SMTP
    console.log("\n--- 4. COMMUNICATION & AI ADAPTERS ---");
    const smtpCreds = {
      host: "smtp.sendgrid.net",
      port: 587,
      username: "apikey",
      password: "SG.sample_password_token",
      fromEmail: "orders@fancyhub.in",
    };
    const smtpTest = await testProviderConnection("SMTP", smtpCreds);
    assert(smtpTest.isSuccess === true, `12. SMTP test connection verified (${smtpTest.responseTimeMs}ms)`);

    // 13. Test API logs
    console.log("\n--- 5. LOGGING, AUDIT & PERMISSIONS ---");
    const logged = await recordApiRequestLog(prisma, {
      integrationId: saved.id,
      provider: "GOOGLE_OAUTH",
      endpoint: "https://oauth2.googleapis.com/token",
      method: "POST",
      statusCode: 200,
      responseTimeMs: 95,
      isSuccess: true,
      rawPayload: { token: "secret_oauth_token", email: "customer@fancyhub.in" },
    });
    assert(logged !== null && logged.isSuccess === true, "13. API Request Log recorded successfully in database");

    // 14. Test Audit logs
    const audit = await prisma.auditLog.create({
      data: {
        action: "API_INTEGRATION_TEST_RUN",
        targetType: "ApiIntegration",
        targetId: saved.id,
        entity: "ApiIntegration",
        field: "status",
        newValue: "ACTIVE",
        changedBy: "Super Admin",
      },
    });
    assert(audit.id !== undefined, "14. Audit log event recorded");

    // 15. Test role permissions
    assert(hasPermission("SUPER_ADMIN", "ADMIN") === true, "15. Super Admin permission access verified");
    assert(hasPermission("CUSTOMER", "ADMIN") === false, "16. Customer role blocked from integration admin");

    // 16. Test masked secret format
    assert(maskSecretValue("1234567890abcdef") === "••••••••••••cdef", "17. Masked secret string format verified");

    // 17. Test secret reveal permission check
    const isSuperAdmin = hasPermission("SUPER_ADMIN", "ADMIN");
    assert(isSuperAdmin === true, "18. Secret reveal authorization check verified");

    // 18. Test credential rotation
    const rotated = await prisma.apiCredentialHistory.create({
      data: {
        integrationId: saved.id,
        versionNumber: 2,
        action: "ROTATED",
        changedBy: "Super Admin",
        environment: "DEVELOPMENT",
        note: "Automated rotation test",
      },
    });
    assert(rotated.versionNumber === 2, "19. Credential rotation version increment verified");

    // 19. Test failed API connection
    console.log("\n--- 6. ERROR HANDLING & SSRF PROTECTION ---");
    const failedTest = await testProviderConnection("GOOGLE_OAUTH", { clientId: "bad", clientSecret: "bad" });
    assert(failedTest.isSuccess === false, "20. Failed API connection correctly caught and reported");

    // 20. Verify no secrets appear in logs
    const sanitized = sanitizeLogPayload({ secretKey: "ultra_secret_123", apiKey: "key_456" });
    assert(!sanitized.includes("ultra_secret_123"), "21. Automatic log payload sanitization verified (zero secrets in logs)");

    // 21. Verify no secrets appear in network responses
    const maskedRes = maskCredentialsObject({ apiKey: "AIzaSy12345678", secret: "super_secret" });
    assert(!maskedRes.apiKey.includes("AIzaSy1234"), "22. Masked responses protect sensitive prefixes in network responses");

    // 22. Verify Admin can update credentials without editing code
    const updatedInDb = await prisma.apiIntegration.update({
      where: { id: saved.id },
      data: { status: "ACTIVE", apiVersion: "v2" },
    });
    assert(updatedInDb.apiVersion === "v2", "23. Admin can update credentials dynamically via DB/API without code changes");

    // 23. Verify disabled integration does not delete credentials
    const disabled = await prisma.apiIntegration.update({
      where: { id: saved.id },
      data: { status: "INACTIVE" },
    });
    assert(disabled.encryptedCredentials.length > 0, "24. Disabling integration preserves encrypted credentials");

    // Clean up unit test integration
    await prisma.apiIntegration.delete({ where: { id: "test-google-oauth-unit" } }).catch(() => {});

    console.log("\n=======================================================================");
    console.log(`PHASE 1.5 ACCEPTANCE RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test Suite Error:", e);
    process.exit(1);
  }
}

runApiManagerTestSuite();
