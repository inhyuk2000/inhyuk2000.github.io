---
title: "사용자 재질문 처리 전략"
date: 2026-08-16
summary: "pending flag를 활용해 재질문 처리용 LLM 추가"
tags:
  - NotiLLM
  - Evaluation
  - LangSmith
  - 코드 수정
authors:
  - me
featured: true
diagram: true
---

## backend/app/pending.py 추가

{{% high_mark %}}**Sequence Diagram**{{% /high_mark %}}
```mermaid
sequenceDiagram
    participant U as 사용자
    participant App as Android PromptEngine
    participant API as FastAPI handle
    participant C as gpt-4o-mini 분류
    participant E as gpt-4o 추출

    U->>App: 카톡만 받아줘
    App->>API: pending=false
    API->>E: extract
    E-->>API: ok=false + 재질문
    API-->>App: ok=false
    App->>App: pendingOriginal 저장

    U->>App: 1시간
    App->>API: pending=true + pendingOriginal
    API->>C: 이전+이번 분류
    C-->>API: supplement
    API->>E: 합친 prompt로 extract
    E-->>API: ok=true + 규칙
    API-->>App: ok=true
    App->>App: 규칙 저장, pending clear
```

### `classify_pending_turn` 함수
재질문 대기 중일 때, {{% high_mark %}}**이번 입력이 보충인지 새 명령인지 LLM으로 판별**{{% /high_mark %}}한다.
- `pending_original`: 재질문 전 사용자 명령
- `current_prompt`: 재질문 후 사용자 입력
- `supplement`: 이전 명령에 대한 보충 (예: 1시간)
- `new_command`: 이전과 무관한 새 규칙


### `resolve_extract_prompt` 함수
handle 앞에서 {{% high_mark %}}**추출용 prompt 문자열을 만드는 진입점**{{% /high_mark %}} 역할을 한다.
- `prompt`: 이번 사용자 입력
- `pending`: 앱이 보낸 재질문 대기 여부
- `pending_original`: 재질문 전 원문
- `(extract_prompt, classification)`: 추출 LLM에 넣을 문장 + 분류 결과 [None: 분류 안함]

> [!todo] 추가 재질문 (Pending 처리) LLM이 실 기기에서 동작하는 지에 대한 테스트 진행 필요