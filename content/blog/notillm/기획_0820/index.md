---
title: "Version 간 A/B test"
date: 2026-08-20
summary: "LangGraph를 사용하기 이전(전부 4o모델) vs 모델 분기 비교 실험"
tags:
  - NotiLLM
  - Evaluation
  - LangGraph
  - 기획
authors:
  - me
featured: true
diagram: true
---

### 결과
| Metric | Baseline | Routing V2 | Change (%) |
|---|---:|---:|---:|
| Runs | 85.0000 | 85.0000 | 0.0000 |
| Total Cost ($) | **0.8520** | **0.7277** | -14.5903 |
| Avg Cost ($) | 0.0100 | 0.0086 | -14.5903 |
| Mean Latency (s) | 4.6433 | 7.5294 | +62.1563 |
| P50 Latency (s) | 4.2594 | 7.3486 | +72.5282 |
| P95 Latency (s) | **7.2314** | **9.9255** | +37.2561 |
| P99 Latency (s) | 9.4063 | 13.0560 | +38.8006 |

> LLM-based routing은 비용을 감소시켰지만 sequential LLM calls로 P95 latency가 너무 증가하는 문제점이 생겼다. **Total Cost와 Latency의 문제를 둘 다 잡는 다른 방법**에 대한 고민이 필요해보였다..

LLM Router 까지 두어서 **LLM 모델을 두 번 처리하는 게 문제**였기에, {{% high_mark %}}**LLM Router를 제거하고 lightweight intent classifier로 대체**{{% /high_mark %}}하려고 함.
- 기존 `LLM Router` 대신 `sentenceTransformer` + `LogisticRegression` 기반 classifier로 구현하고자 함.

### `v1` vs `v2` vs `v3`

| Metric                   | V1 Baseline | V2 LLM Router | V3 Classifier |    V3 vs V2 |
| ------------------------ | ----------: | ------------: | ------------: | ----------: |
| Runs                     |          85 |            85 |            85 |           - |
| Extract Rule Correctness |           - |        0.8824 |    **0.9221** | **+3.97%p** |
| Route Correctness        |           - |    **1.0000** |        0.9870 | **-1.30%p** |
| Total Cost ($)           |      0.8520 |    **0.7277** |       0.7584* |      +4.21% |
| Avg Cost / Total Run ($) |      0.0100 |    **0.0086** |       0.0089* |      +4.21% |
| Mean Latency (s)         |      4.6433 |        7.5294 |    **4.9249** | **-34.59%** |
| P50 Latency (s)          |      4.2594 |        7.3486 |    **4.8236** | **-34.36%** |
| P95 Latency (s)          |      7.2314 |        9.9255 |    **7.1742** | **-27.72%** |
| P99 Latency (s)          |      9.4063 |       13.0560 |       39.0470 |    +199.07% |
| Max Latency (s)          |     12.2559 |       16.1798 |       43.0408 |    +166.02% |

- V3 Classifier는 V2 대비 Extract Correctness +3.97%p 개선
- V3는 V2 대비 P50 Latency 34.36%, P95 Latency 27.72% 감소
- V3의 P95는 7.17s로 V1 Baseline(7.23s) 수준까지 회복
- Route Correctness는 1.0000 → 0.9870으로 1.3%p 소폭 감소
- V3 비용은 85건 중 18건 cost 미기록이라 추가 확인 필요
- V3 P99 39.05s는 일부 극단적 latency outlier 영향으로 보임

> [!caution] V3는 85건 중 67건만 cost가 기록되고 18건은 결측이라, cost 비교는 해당 18건이 실제 LLM 미호출(cost=0)인지 확인한 뒤 확정