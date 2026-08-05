---
title: "블록체인을 활용한 신뢰 기반 이미지 거래 서비스, BlockSnap"
date: 2025-07-15
summary: "블록체인 기반으로 이미지 진위 여부를 검증하고, 신뢰 기반 거래 환경을 구축합니다."
tags: 
  - 수업
  - 팀
  - 프로젝트
tech_stack:
  - Flutter
  - Hash Algorithms
  - MetaMask
  - Smart Contract
  - Notion
  - Github
links:
  - type: github
    url: https://github.com/HuhJunny/blockchain_true_image_app
    label: Code
  - type: paper
    url: https://drive.google.com/file/d/1CPt-9khFtUVktb-fvT-h_QIp4cXdJLIS/view?usp=sharing
    label: ppt
featured: true
status: "Done"
role: "Backend 담당"
duration: "3 months"
team_size: 4
highlights:
  - "Handles 10k+ concurrent users"
  - "99.9% uptime SLA"
  - "Processing $50k+ monthly transactions"
  - "60% faster page load vs competitors"
---

### 설명
- **프로젝트 이름** : 신뢰 기반 이미지 거래 서비스, BlockSnap
- **프로젝트 기간** : 2026.03 ~ 2026.06
- **프로젝트 설명** : 블록체인의 온체인에 이미지 메타데이터를 등록해 위조가 불가능한 이미지 데이터를 생성하고, 이를 거래할 수 있는 서비스
- **프로젝트 목적** : AI로 생성된 이미지가 굉장히 많아, 구별이 힘든 삶을 살아가고 있는 상황 속에서 검증된 이미지를 통해 사용자를 안심시켜주기 위함
- **프로젝트 성과** : 이미지 거래 서비스 개발

### API 설계
백엔드 파트를 맡고, 여러 팀원들이 협업하며 동일한 서비스를 개발하기 위해서 API를 통일하고 인지해야 할 필요성이 있었습니다.

따라서 각 기능 별 **Request Header**, **Request Body**, **Response Header**, **Response Body**, **Error Type** 들을 전부 정리하는 식으로 설계를 시작했습니다.

### 스마트 컨트랙트 저장 구조 설계

이미지 거래 과정에서 발생하는 소유권과 거래 이력을 위변조가 어렵도록 관리하기 위해, 거래에 필요한 핵심 정보는 스마트 컨트랙트에 저장하고 실제 이미지 파일과 일부 상세 정보는 Off-chain 영역에 분리해 저장하도록 설계했습니다.

| 구분              | 필드                   | 설명                                          |
| --------------- | -------------------- | ------------------------------------------- |
| **기본 블록 정보**    | `blockNumber`        | 거래가 기록된 블록 번호                               |
|                 | `timestamp`          | 블록이 생성된 시간                                  |
| **트랜잭션 정보**     | `txHash`             | 각 거래를 구분하는 고유 트랜잭션 해시                       |
|                 | `buyer`              | 구매자 지갑 주소                                   |
|                 | `seller`             | 판매자 지갑 주소                                   |
|                 | `signature`          | 거래 당사자와 소유권을 인증하기 위한 서명값                    |
| **이미지 정보**      | `imageHash`          | 이미지 위변조 여부를 검증하기 위한 해시값                     |
|                 | `imageUrl`           | Amazon S3에 저장된 실제 이미지의 Off-chain 주소         |
|                 | `metadata`           | 이미지 제목, 설명, 카테고리 등 부가 정보                    |
| **거래 정보**       | `price`              | 이미지 거래 가격                                   |
|                 | `tokenId`            | 이미지 자산을 식별하기 위한 토큰 ID                       |
|                 | `tokenType`          | ERC-721, ERC-1155 등 토큰 표준                   |
| **검증 및 인증 정보**  | `verificationStatus` | 이미지 검증 상태 (`VERIFIED`, `PENDING`, `FAILED`) |
|                 | `deviceId`           | 촬영에 사용된 디바이스 식별 정보                          |
| **로열티 및 수익 분배** | `royaltyRate`        | 재판매 시 적용되는 원작자 로열티 비율                       |
|                 | `creator`            | 원작자의 지갑 주소                                  |

모든 데이터를 온체인에 저장하면 저장 비용과 처리 부담이 커질 수 있기 때문에, 이미지의 위변조 검증과 소유권 증명에 필요한 `imageHash`, 거래 주소, 서명, 가격 등의 핵심 정보는 On-chain에 저장하고, 실제 이미지 파일과 상세 메타데이터는 Amazon S3에 Off-chain으로 관리했습니다.

이를 통해 블록체인의 무결성과 추적 가능성을 활용하면서도 저장 비용과 시스템 성능을 함께 고려한 구조를 설계했습니다.


### 프로젝트를 진행하며 느낀점
백엔드 개발을 담당하며 프론트엔드 팀과 스마트 컨트랙트 팀 사이의 협업 과정을 경험했습니다. 프로젝트 초기에는 각 파트가 동일한 기능과 데이터 구조를 이해할 수 있도록 요청·응답 형식과 예외 상황을 포함한 API 명세서를 구체적으로 작성했습니다. {{% high_mark %}}**명세를 정리하는 과정에는 많은 시간이 필요했지만, 이후 파트 간 소통 비용과 구현 과정의 혼선을 줄여 프로젝트 후반부의 개발 속도를 높이는 데 기여했습니다.**{{% /high_mark %}}

또한 이미지 해시를 활용한 유사 이미지 검증 로직을 백엔드에 구현하며 여러 예외 상황과 기술적 문제를 해결했습니다. 이 과정에서 API 명세는 단순히 인터페이스를 기록하는 문서가 아니라, 문제의 발생 지점과 각 파트의 책임 범위를 명확하게 정의하고 해결 방향을 공유하는 협업 도구라는 점을 배울 수 있었습니다.