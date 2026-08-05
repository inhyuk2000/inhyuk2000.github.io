---
title: "NotiLLM : LLM 기반 자연어 알림 전송 제어"
date: 2026-08-04
summary: "자연어로 알림 수신 조건을 설정하고, LLM Function Calling으로 규칙을 추출해 Android에서 hold/deliver하는 시스템"
tags: 
  - 개인
  - 배포
  - 서비스
tech_stack:
  - Android
  - Kotlin
  - LLM
  - Function Calling
  - Notification
  - Github
links:
  - type: github
    url: https://github.com/inhyuk2000/A-Multi-Agent-Debate-Framework-of-Multiple-Language-Models-for-Hallucination-Detection-Correction
    label: Code
featured: true
status: "Live"
role: "서비스 개발자"
duration: "1 months"
team_size: 1
highlights:
  - "Handles 10k+ concurrent users"
  - "99.9% uptime SLA"
  - "Processing $50k+ monthly transactions"
  - "60% faster page load vs competitors"
---

알림을 앱마다 일일이 끄는 대신, **카톡만 받아줘** 혹은 **지금부터 1시간 조용히**처럼 말로 규칙을 만들고 실제 알림 흐름을 제어하는 시스템을 만들었습니다.

## Table of Contents
- 작성 예정

## Problem {#problem}
- 기존 DND/앱 알림 설정은 메뉴가 깊고 조건 표현이 제한적
- ML 기반 자동 예측은 실패 시 신뢰가 깨지기 쉬움
- 목표: **자연어 → 구조화된 규칙 → 알림 hold/deliver**

## Conclusion
- 직성 예정


## Resources
- 작성 예정

## 느낀점
- AI Agent를 활용해 실서비스를 빠르게 만들어보고, Function Calling과 같은 서비스의 핵심 로직과 관련한 부분은 충분한 고민을 하며 개발 중에 있습니다. 현재 일회성 명령 뿐만 아니라 주기성 명령까지도 전부 고려하기 위해서, Function Calling이 동작하는 핵심 로직, 데이터 저장 구조를 변경할 필요성을 느껴 해당 부분에 대한 개발이 진행중입니다.

---

Questions? Leave a comment below or reach out on [Github](https://github.com/inhyuk2000/A-Natural-Language-based-Notification-Delivery-Control-System-Using-LLM)!
