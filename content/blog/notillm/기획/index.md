---
title: "전체 NotiLLM Schedule 및 Architecture 설계"
date: 2026-08-11
summary: "기획"
tags:
  - NotiLLM
  - Evaluation
authors:
  - me
featured: true
diagram: true
---

## Schedule

단순히 기능을 추가하는 방식이 아니라, **측정 가능한 기준을 세우고 반복적으로 개선하는 과정**을 중심으로 프로젝트를 진행했습니다.

아래와 같이 단순한 LLM 기능 구현을 넘어, `Evaluation` - `Optimization` - `Validation` - `Production` 으로 이어지는 AI Engineering 전 과정을 경험하는 것을 목표로 합니다.

<table>
  <thead>
    <tr>
      <th style="text-align:center;">순서</th>
      <th>할 일</th>
      <th>핵심 산출물</th>
      <th>키우는 역량</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: rgba(81, 255, 0, 0.18);">
      <td style="text-align:center;"><small><strong>1</strong></small></td>
      <td><small>현재 시스템 Baseline 고정</small></td>
      <td><small>v1 구조/성능 기준</small></td>
      <td><small>System Design</small></td>
    </tr>
    <tr style="background-color: rgba(81, 255, 0, 0.18);">
      <td style="text-align:center;"><small><strong>2</strong></small></td>
      <td><small>Evaluation Dataset 구축</small></td>
      <td><small>Ground Truth Dataset</small></td>
      <td><small>LLM Evaluation</small></td>
    </tr>
    <tr style="background-color: rgba(81, 255, 0, 0.18);">
      <td style="text-align:center;"><small><strong>3</strong></small></td>
      <td><small>자동 Evaluation 구현</small></td>
      <td><small>평가 코드 + 지표</small></td>
      <td><small>AI Engineering</small></td>
    </tr>
    <tr style="background-color: rgba(81, 255, 0, 0.18);">
      <td style="text-align:center;"><small><strong>4</strong></small></td>
      <td><small>Error Analysis</small></td>
      <td><small>실패 유형/원인</small></td>
      <td><small>Problem Solving</small></td>
    </tr>
    <tr style="background-color: rgba(255, 215, 0, 0.18);">
      <td style="text-align:center;"><small><strong>5</strong></small></td>
      <td><small>구조/Prompt 개선</small></td>
      <td><small>v2</small></td>
      <td><small>LLM Engineering</small></td>
    </tr>
    <tr style="background-color: rgba(255, 0, 0, 0.18);">
      <td style="text-align:center;"><small><strong>6</strong></small></td>
      <td><small>LangGraph 도입 검토</small></td>
      <td><small>Stateful Agent</small></td>
      <td><small>Agent Engineering</small></td>
    </tr>
    <tr style="background-color: rgba(255, 215, 0, 0.18);">
      <td style="text-align:center;"><small><strong>7</strong></small></td>
      <td><small>재평가 + 통계 검증</small></td>
      <td><small>v1 vs v2 결과</small></td>
      <td><small>Experimentation</small></td>
    </tr>
    <tr style="background-color: rgba(255, 0, 0, 0.18);">
      <td style="text-align:center;"><small><strong>8</strong></small></td>
      <td><small>Reliability 강화</small></td>
      <td><small>Retry/Fallback/Validation</small></td>
      <td><small>Production AI</small></td>
    </tr>
    <tr style="background-color: rgba(255, 215, 0, 0.18);">
      <td style="text-align:center;"><small><strong>9</strong></small></td>
      <td><small>실제 사용자 배포</small></td>
      <td><small>테스트 사용자</small></td>
      <td><small>Product Engineering</small></td>
    </tr>
    <tr>
      <td style="text-align:center;"><small><strong>10</strong></small></td>
      <td><small>Analytics/Crashlytics 분석</small></td>
      <td><small>실사용 데이터</small></td>
      <td><small>Product Analytics</small></td>
    </tr>
    <tr>
      <td style="text-align:center;"><small><strong>11</strong></small></td>
      <td><small>사용자 실험/A-B Test</small></td>
      <td><small>Product 효과 검증</small></td>
      <td><small>Experiment Design</small></td>
    </tr>
    <tr>
      <td style="text-align:center;"><small><strong>12</strong></small></td>
      <td><small>최종 포트폴리오 정리</small></td>
      <td><small>GitHub/Portfolio</small></td>
      <td><small>취업</small></td>
    </tr>
  </tbody>
</table>

본격적인 `Evaluation`을 진행하기에 앞서서, 전체 `Architecture`를 먼저 설계해 어느 부분을 평가할 지에 대한 계획을 수립했습니다.

## Baseline Ver.1 Architecture
- {{% high_mark %}}**Mermaid**{{% /high_mark %}} 목적 : Evaluation 시, {{% high_mark %}}**어느 Component에서 문제가 발생하는지 특정**{{% /high_mark %}}하기 위함
- `ChatGPT-4o` 모델로 `Function Calling` 전체 처리

```mermaid
flowchart TB
  user((User))
  router["Router<br/>GPT-4o w/<br/>function calling"]

  user -->|chat command| router
  router -->|reply| user

  parse[Parse User Intent]
  choose[Choose mute / allow tool]
  router --> parse --> choose

  cond["extract_notification_condition<br/>(time / recurrence)"]
  mute["extract_mute_target<br/>(name / content)"]
  allow["extract_allow_target<br/>(name / content)"]

  choose -->|function call| cond
  choose -->|function call| mute
  choose -->|function call| allow

  c1[Infer delivery / expires]
  c2[Set recurrence / window]
  m1[Extract mute apps / keywords]
  m2[Normalize app names]
  a1[Extract mute apps / keywords]
  a2[Normalize app names]

  cond --> c1 --> c2
  mute --> m1 --> m2
  allow --> a1 --> a2

  c2 -.->|tool result| router
  m2 -.->|tool result| router
  a2 -.->|tool result| router

  merge["PromptEngine Merge<br/>(target + condition)"]
  inj[Inject mute flag]
  build[Build target JSON]
  cm[ContextManager]
  mapPkg[Map app name to package]
  validate[Validate delivery before expires]
  save[Save rule to SQLite]
  db[(SQLite)]

  router -->|two JSONs| merge
  merge --> inj --> build --> cm --> mapPkg --> validate --> save
  save -->|Persist mode / apps / window| db

  classDef userNode fill:#7eb8da,stroke:#4a90b8,color:#fff
  classDef routerNode fill:#e8a0a0,stroke:#c07070,color:#222
  classDef stepRed fill:#fff5f5,stroke:#c07070,color:#b33
  classDef toolNode fill:#90c9a0,stroke:#5a9a6a,color:#222
  classDef stepGreen fill:#f3faf5,stroke:#5a9a6a,color:#2a7a3a
  classDef dbNode fill:#a8d5b5,stroke:#5a9a6a,color:#222
  class user userNode
  class router routerNode
  class parse,choose,c1,c2,m1,m2,a1,a2 stepRed
  class cond,mute,allow toolNode
  class merge,cm stepGreen
  class inj,build,mapPkg,validate,save stepGreen
  class db dbNode
```

## 평가 방식

> [!Question] 각 Tools (`extract_notification_condition`, `extract_mute_target`, `extract_allow_target`) 에 따라 **어떤 평가 방식**을 사용해야 할까?

지금 평가 대상이 **자유로운 자연어 답변이 아니라 스키마가 정해진 구조화된 JSON**이고, 이미 **Ground Truth**를 만들 수 있다. 그래서 굳이 또 다른 LLM의 주관적 판단을 끼워 넣을 필요가 없다고 판단했습니다.

### 평가 방식 선정
> [!check] `Code-based evals` 선정

`Function Calling`의 출력이 정해진 `JSON Schema`를 따르는 **구조화된 데이터**이므로, 각 필드를 `Ground Truth`와 직접 비교하는 {{% high_mark %}}**Code-based Eval 방식**{{% /high_mark %}}을 사용하기로 결정했습니다.

### Function Calling이 현재 출력하는 JSON 필드

<div class="schema-tool-grid">

<!-- LEFT : 50% WIDTH / 100% HEIGHT -->
<div class="schema-tool-panel">

<div class="schema-tool-label">
extract_notification_condition
</div>

<pre class="schema-tool-pre"><code>{
  "name": "extract_notification_condition",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "delivery": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "absolute": { "type": "string" }
        },
        "required": ["absolute"]
      },
      "activity": {
        "type": ["string", "null"]
      },
      "location": {
        "type": ["string", "null"]
      },
      "expires": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "absolute": { "type": "string" }
        },
        "required": ["absolute"]
      },
      "recurrence": {
        "type": "string",
        "enum": ["none", "daily", "weekly"]
      },
      "days_of_week": {
        "type": "array",
        "items": {
          "type": "integer"
        }
      },
      "window_start": {
        "type": ["string", "null"]
      },
      "window_end": {
        "type": ["string", "null"]
      }
    },
    "required": [
      "delivery",
      "activity",
      "location",
      "expires",
      "recurrence",
      "days_of_week",
      "window_start",
      "window_end"
    ]
  }
}</code></pre>

</div>


<!-- RIGHT : 50% WIDTH -->
<div class="schema-tool-stack">


<!-- RIGHT TOP : 50% HEIGHT -->
<div class="schema-tool-panel">

<div class="schema-tool-label">
extract_mute_target
</div>

<pre class="schema-tool-pre"><code>{
  "name": "extract_mute_target",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "name": {
        "type": "array",
        "items": {
          "type": ["string", "null"]
        }
      },
      "content": {
        "type": "array",
        "items": {
          "type": ["string", "null"]
        }
      }
    },
    "required": [
      "name",
      "content"
    ]
  }
}</code></pre>

</div>


<!-- RIGHT BOTTOM : 50% HEIGHT -->
<div class="schema-tool-panel">

<div class="schema-tool-label">
extract_allow_target
</div>

<pre class="schema-tool-pre"><code>{
  "name": "extract_allow_target",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "name": {
        "type": "array",
        "items": {
          "type": ["string", "null"]
        }
      },
      "content": {
        "type": "array",
        "items": {
          "type": ["string", "null"]
        }
      }
    },
    "required": [
      "name",
      "content"
    ]
  }
}</code></pre>

</div>

</div>

</div>

---

## References

* [**DeepLearningAI**](https://www.deeplearning.ai/courses/evaluating-ai-agents?utm_source=chatgpt.com)