---
title: "NotiLLM : LLM 기반 자연어 알림 전송 제어"
date: 2026-08-04
summary: "자연어로 알림 수신 조건을 설정하고, LLM Function Calling으로 규칙을 추출해 Android에서 알림을 hold/deliver하는 시스템"
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

> [!WARNING] 해당 서비스는 연구실의 아이디어를 기반으로 서비스화한 것으로, 관련 저작권은 연구실에 있습니다.

> [!WARNING] 정리예정입니다.

## Table of Contents
- 작성 예정

## Problem {#problem}
- 기존 수동제어 기반 방식은 사용자의 직접 설정을 필요로 하므로, **사용자 부담이 증가**하고 사용성이 떨어집니다.
- 반대로 ML 기반 알림 수신 타이밍 예측 방식들은 정확성을 높이기 위한 연구들이 많이 진행되고 있지만, 근본적으로 사용자의 비언어적 신호를 기반으로 하기에 **예측이 부정확**합니다.
- 따라서 본 연구는 수동 제어 방식의 불편함과 모델 기반 방식의 부정확성을 둘 다 잡고 해결하기 위해, **LLM 기반 사용자 제어**를 진행합니다.

> [!NOTE] 본 서비스는 연구실의 아이디어를 실제 서비스로 확장하고, 배포 및 운영 경험을 바탕으로 후속 연구 및 서비스 고도화를 진행하기 위한 목적으로 개발되었습니다.

## Conclusion
- 직성 예정


## Resources
- 작성 예정

## 느낀점
- AI Agent를 활용해 실서비스를 빠르게 만들어보고, Function Calling과 같은 서비스의 핵심 로직과 관련한 부분은 충분한 고민을 하며 개발 중에 있습니다. 현재 일회성 명령 뿐만 아니라 주기성 명령까지도 전부 고려하기 위해서, Function Calling이 동작하는 핵심 로직, 데이터 저장 구조를 변경할 필요성을 느껴 해당 부분에 대한 개발이 진행중입니다.

---

Questions? Leave a comment below or reach out on [Github](https://github.com/inhyuk2000/A-Natural-Language-based-Notification-Delivery-Control-System-Using-LLM)!
