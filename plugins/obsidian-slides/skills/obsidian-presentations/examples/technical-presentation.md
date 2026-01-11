---
categories:
  - "[[Presentation]]"
type: []
created: 2026-01-11
---

# Microservices Architecture Migration

**Sarah Chen, Principal Engineer**
**January 2026**

%%
TALKING POINTS:
Welcome everyone. Today I'll share our journey migrating from a monolithic architecture to microservices, covering the challenges we faced, solutions we implemented, and results we achieved.

DELIVERY:
- Introduce yourself and role
- Set expectations: 15-minute technical deep-dive
- Mention Q&A at the end

TIME: 1 minute
%%

---

## Why We Needed to Change

- **Scaling bottlenecks** - Entire app scaled as one unit
- **Deployment risks** - Any change could break everything
- **Team friction** - 50 engineers working in same codebase

![Chart showing deployment frequency (once/month) and incident rate (12% of deploys)]

%%
TALKING POINTS:
Our monolithic Rails app served us well for 5 years, but we hit a wall. We could only scale vertically—throwing bigger servers at the problem. Every deployment was nerve-wracking because any bug could take down the entire platform.

With 50 engineers, merge conflicts were constant. Teams blocked each other. A bug in the billing module could delay a feature in user management.

CONTEXT:
This was costing us: slow feature delivery, expensive infrastructure, high stress.

TRANSITION:
These pain points led us to explore microservices.

TIME: 2-3 minutes
%%

---

## Our Microservices Strategy

![Architecture diagram showing frontend, API gateway, 6 microservices (Auth, Users, Billing, Orders, Inventory, Notifications), and shared PostgreSQL + Redis]

**Core Services:**
- Auth & Sessions
- User Management
- Billing & Payments
- Order Processing
- Inventory
- Notifications

%%
TALKING POINTS:
We designed 6 core services based on bounded contexts from domain-driven design. Each service owns its data and exposes a REST API.

TECHNICAL DETAILS:
- API Gateway (Kong) handles routing and auth
- Shared PostgreSQL with schema-per-service
- Redis for caching and session storage
- Docker + Kubernetes for orchestration

Note: We chose shared database initially to simplify migration. Plan to split databases in Phase 2.

ANTICIPATED QUESTION:
"Why shared database?" - Pragmatic choice. Full database isolation adds complexity we weren't ready for during migration.

TIME: 3-4 minutes
%%

---

## Migration Approach: Strangler Pattern

```python
# Route requests based on feature flags
def route_request(request):
    if feature_flag.enabled('new_billing'):
        return billing_service.handle(request)
    else:
        return legacy_monolith.handle(request)
```

1. Build new service
2. Route subset of traffic
3. Monitor and iterate
4. Increase traffic gradually
5. Deprecate monolith code

%%
TALKING POINTS:
We used the Strangler Fig pattern—gradually replace the monolith by routing traffic to new services. Feature flags gave us control and safety.

EXAMPLE:
Billing was first. We built the new service, routed 5% of traffic, watched for errors. No issues? Bump to 20%. Then 50%. Then 100%. Finally, deleted monolith code.

This de-risked the migration. If something broke, flip the flag back.

CODE WALKTHROUGH:
The code shows the basic pattern—feature flag determines routing. In production, we used LaunchDarkly for more sophisticated control.

TIME: 4 minutes
%%

---

## Challenges We Faced

**Distributed Transactions:**
- No ACID guarantees across services
- Implemented Saga pattern for consistency

![Sequence diagram showing Saga pattern with compensating transactions]

**Service Discovery:**
- Services need to find each other
- Used Kubernetes DNS + service mesh (Istio)

**Observability:**
- Logs scattered across services
- Adopted distributed tracing (Jaeger) and centralized logging (ELK)

%%
TALKING POINTS:
Migration wasn't smooth sailing. Distributed systems introduce complexity.

TRANSACTIONS:
Without a single database, we couldn't use ACID transactions. Order processing spans Billing, Inventory, and Orders. We implemented the Saga pattern—a sequence of local transactions with compensating actions if something fails.

DISCOVERY:
Services need to know where others are. Kubernetes DNS handles service discovery. Istio provides load balancing, retry logic, and circuit breaking.

OBSERVABILITY:
Debugging distributed systems is hard. A request touches 5 services—where did it fail? Jaeger gives us distributed tracing to follow requests. ELK aggregates logs from all services.

LESSON LEARNED:
Invest in observability early. You'll need it.

TIME: 4-5 minutes
%%

---

## Results: 6 Months Post-Migration

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Deploy frequency | 1/month | 15/day | **15x** |
| Incident rate | 12% | 3% | **-75%** |
| P95 latency | 850ms | 320ms | **-62%** |
| Infrastructure cost | $45K/mo | $32K/mo | **-29%** |

%%
TALKING POINTS:
The numbers speak for themselves. We're deploying 15 times per day now—teams ship independently without blocking each other.

INCIDENTS:
Incident rate dropped dramatically. When something breaks, it's isolated to one service. The rest of the platform keeps running.

PERFORMANCE:
Latency improved because we can optimize each service independently. The old monolith loaded everything; now we load only what's needed.

COST SAVINGS:
Despite running more infrastructure, costs dropped. We scale only the services under load. The monolith required massive servers even if only one feature was busy.

CONTEXT:
These improvements unlocked faster product iteration, which drove revenue growth.

TIME: 3 minutes
%%

---

## Key Takeaways

1. **Start small** - Strangler pattern reduces risk
2. **Invest in platform** - Observability, service mesh, CI/CD are essential
3. **Bounded contexts** - DDD helps define service boundaries
4. **Accept complexity** - Distributed systems are harder, but worth it at scale

%%
TALKING POINTS:
If you're considering microservices, learn from our experience.

Don't big-bang migrate—use Strangler pattern. Build platform capabilities early—you need good observability. Study domain-driven design to identify service boundaries properly. And understand the tradeoffs—microservices add complexity, so make sure you need them.

For us, at 50+ engineers and growing, the benefits outweigh the costs. For a 5-person startup? Probably not.

CLOSING:
Happy to answer questions about any aspect of the migration.

TIME: 2 minutes
%%

---

## Thank You!

**Questions?**

**Contact:** sarah.chen@example.com
**Slides & code:** github.com/example/microservices-migration

%%
DELIVERY:
Thank the audience.
Open floor for questions.
Be ready to dive deeper on any technical aspect.

COMMON QUESTIONS:
- Database per service? "Phase 2. Started with shared for simplicity."
- Which language? "Go for new services. Monolith was Ruby."
- Team structure? "Organized around services. Each team owns 1-2 services."

TIME: 5 minutes for Q&A
%%
