# FancyHub.in 2.0 — Production Disaster Recovery & Business Continuity Runbooks

## 🛡️ Executive Summary & Recovery Objectives
- **Target RTO (Recovery Time Objective)**: < 5 minutes for compute/application, < 15 minutes for full database restoration.
- **Target RPO (Recovery Point Objective)**: 0 seconds for financial ledger transactions; < 1 minute for continuous WAL database archiving.
- **Safety Invariant**: Destructive tests and dry runs MUST NEVER be executed against live production databases. All destructive recovery rehearsal must be isolated to Staging/Sandbox environments.

---

## 📋 Master Runbook Index

### 1. Runbook 1: Database Failure (`RB-01-DB-FAIL`)
- **Severity**: P0_CRITICAL | **RTO**: < 2 minutes | **RPO**: 0 seconds
- **Prerequisites**: AWS RDS Multi-AZ active across `ap-south-1a` and `ap-south-1b`. Connection pool configured with auto-reconnection.
- **Action Steps**:
  1. Automated AWS RDS heartbeat monitor flags primary DB loss.
  2. Aurora / RDS initiates automated Multi-AZ failover to standby replica.
  3. RDS cluster endpoint DNS automatically directs queries to the new primary instance.
  4. Prisma connection pool drains dead sockets and reconnects.
  5. Verify read/write health via `/api/health`.

### 2. Runbook 2: Application / ECS Failure (`RB-02-APP-FAIL`)
- **Severity**: P0_CRITICAL | **RTO**: < 30 seconds | **RPO**: 0 seconds
- **Prerequisites**: AWS ALB target group health checks on `/api/health`.
- **Action Steps**:
  1. ALB health check identifies crashed or unresponsive container.
  2. ALB stops traffic routing to degraded task.
  3. ECS service scheduler launches fresh container task definition.
  4. Container warms up and passes readiness probe.
  5. ALB re-registers healthy task into active load balancing.

### 3. Runbook 3: Payment Gateway Failure (`RB-03-PAY-FAIL`)
- **Severity**: P0_CRITICAL | **RTO**: < 1 minute | **RPO**: 0 seconds (Idempotent)
- **Prerequisites**: Secondary gateway (PhonePe / Cashfree) active with verified production credentials.
- **Action Steps**:
  1. Observability Engine detects 3 consecutive gateway timeouts.
  2. Automated circuit breaker trips and fails over to secondary gateway.
  3. Storefront checkout dynamically adapts client SDK.
  4. Interrupted in-flight payments enqueued for status reconciliation.
  5. Super Admin notified via emergency channels.

### 4. Runbook 4: Bad Production Deployment (`RB-04-BAD-DEPLOY`)
- **Severity**: P1_HIGH | **RTO**: < 1 minute | **RPO**: 0 seconds
- **Prerequisites**: Previous known-good Docker image tagged in Amazon ECR. Backward-compatible database schema.
- **Action Steps**:
  1. Automated smoke test or Sentry alert detects elevated error rate post-deploy.
  2. Super Admin executes 1-click ECS rollback via `ApplicationRollbackService.rollbackEcsTask`.
  3. ALB shifts 100% traffic to previous green task definition revision.
  4. Staging environment deployed with bad build for RCA debugging.

### 5. Runbook 5: Data Corruption / Accidental Deletion (`RB-05-DATA-CORRUPT`)
- **Severity**: P0_CRITICAL | **RTO**: < 15 minutes | **RPO**: < 1 minute
- **Prerequisites**: AWS RDS continuous automated backups enabled with 35-day WAL retention.
- **Action Steps**:
  1. Place storefront into Maintenance Mode via Admin ERP to halt incoming writes.
  2. Identify the exact ISO timestamp prior to corruption event.
  3. Execute Point-in-Time-Recovery (PITR) to new instance `fancyhub-db-restored`.
  4. Reconcile double-entry ledger balances and catalog integrity.
  5. Swap database connection string in AWS Secrets Manager and disable Maintenance Mode.

### 6. Runbook 6: Security Incident & Credential Compromise (`RB-06-SEC-INCIDENT`)
- **Severity**: P0_CRITICAL | **RTO**: < 5 minutes | **RPO**: N/A
- **Prerequisites**: AWS Secrets Manager KMS envelope encryption active.
- **Action Steps**:
  1. Invalidate all active customer, vendor, and admin JWT sessions.
  2. Rotate master encryption keys and DB credentials in AWS Secrets Manager.
  3. Invalidate compromised API keys and regenerate webhook secrets.
  4. Block attacker IPs at AWS WAF and CloudFront perimeter.
  5. Ship immutable access logs for forensic investigation.

### 7. Runbook 7: AWS Regional Outage (`RB-07-AWS-REGION`)
- **Severity**: P0_CRITICAL | **RTO**: < 5 minutes | **RPO**: < 1 minute
- **Prerequisites**: Route 53 DNS failover routing, RDS cross-region read-replica in Singapore (`ap-southeast-1`), S3 Cross-Region Replication (CRR).
- **Action Steps**:
  1. AWS Health confirms major regional outage in `ap-south-1` (Mumbai).
  2. Route 53 health check triggers DNS failover to standby cluster in `ap-southeast-1`.
  3. Promote Singapore RDS read-replica to standalone read/write master.
  4. Scale Singapore ECS cluster to full production capacity.
  5. Storefront operations resume globally with zero data loss.
