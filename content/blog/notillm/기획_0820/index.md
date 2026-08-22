---
title: "Version 간 결과 비교/분석"
date: 2026-08-20
summary: "Version 간 평가"
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

**LangGraph를 사용하기 이전(전부 4o모델) vs 모델 분기 비교 실험**

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

| Metric                               | V1 Baseline | V2 LLM Router | V3 Classifier |
| ------------------------------------ | ----------: | ------------: | ------------: |
| Runs                                 |          85 |            85 |            85 |
| Total Cost ($)                       |      0.8557 |        0.7401 |    **0.7224** |
| Avg Cost / Run ($)                   |      0.0101 |        0.0087 |    **0.0085** |
| Mean Latency (s)                     |      4.1386 |        6.2194 |    **3.3433** |
| P50 Latency (s)                      |  **3.1119** |        5.4087 |        3.1164 |
| P95 Latency (s)                      |      7.4149 |       11.0379 |    **7.0132** |
| P99 Latency (s)                      |     12.9387 |       11.9233 |    **8.7200** |
| API Calls                            |          85 |            85 |        **67** |
| API Call Rate (%)                    |      100.00 |        100.00 |     **78.82** |
| Extract Rule Correctness             |      0.8941 |    **0.9048** |        0.9024 |
| Extract Rule Correctness (if routed) |           - |    **0.9048** |        0.8780 |
| Route Correctness                    |           - |    **1.0000** |        0.9756 |

- V3는 V1 대비 비용 15.58%, 평균 Latency 19.22% 감소했고, LLM API 호출도 21.18% 절감함.
- 정확도는 V1 0.8941 → V3 0.9024로 유지·소폭 개선되어, 성능 저하 없이 비용과 응답 속도를 함께 개선함.