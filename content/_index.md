---
# Leave the homepage title empty to use the site title
title: 'In Hyuk Portfolio Homepage'
summary: '송인혁의 개인 웹사이트'
# date: 2026-01-28
type: landing

sections:
  # Developer Hero - Gradient background with name, role, social, and CTAs
  - block: dev-hero
    id: hero
    content:
      username: me
      greeting: "Hi, I'm"
      show_status: true
      show_scroll_indicator: true
      typewriter:
        enable: true
        prefix: "I build"
        strings:
          - "LLM based data analysis systems"
          - "AI-powered software"
          - "LLM-powered applications"
          - "intelligent data analysis tools"
        type_speed: 70
        delete_speed: 40
        pause_time: 2500
      cta_buttons:
        - text: View My Work
          url: "#projects"
          icon: arrow-down
        - text: Get In Touch
          url: "#contact"
          icon: envelope
    design:
      style: centered
      avatar_shape: circle
      animations: true
      background:
        color:
          light: "#fafafa"
          dark: "#0a0a0f"
      spacing:
        padding: ["6rem", "0", "4rem", "0"]
  
  # Filterable Portfolio - Alpine.js powered project filtering
  - block: portfolio
    id: projects
    content:
      title: "프로젝트"
      subtitle: "그동안 배우고 쌓아온 경험들"
      count: 0
      filters:
        folders:
          - projects
      buttons:
        - name: All
          tag: '*'
        - name: 학회
          tag: 학회
        - name: 팀
          tag: 팀
        - name: 개인
          tag: 개인
      default_button_index: 0
      # Archive link auto-shown if more projects exist than 'count' above
      # archive:
      #   # enable: false  # Set to false to explicitly hide
      #   text: "Browse All"  # Customize text
      #   link: "/work/"  # Custom URL
    design:
      columns: 3
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # Visual Tech Stack - Icons organized by category
  - block: tech-stack
    id: skills
    content:
      title: "기술 스택"
      subtitle: "Hard Skills"
      categories:
        - name: Programming Languages
          items:
            - name: Python
              icon: devicon/python
            - name: JavaScript
              icon: devicon/javascript
            - name: C++
              icon: devicon/cplusplus
            - name: MySQL
              icon: devicon/mysql
        - name: AI / Data
          items:
            - name: PyTorch
              icon: devicon/pytorch
            - name: Scikit-Learn
              icon: devicon/scikitlearn
            - name: Pandas
              icon: devicon/pandas
            - name: Numpy
              icon: devicon/numpy
        - name: LLM Engineering & DevOps
          items:
            - name: OpenAPI
              icon: devicon/openapi
            - name: GitHub Actions
              icon: brands/github
            - name: AWS
              icon: devicon/amazonwebservices
            - name: Babel
              icon: devicon/babel
    design:
      style: grid
      show_levels: false
      background:
        color:
          light: "#f5f5f5"
          dark: "#08080c"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # Experience Timeline
  - block: resume-experience
    id: experience
    content:
      title: Experience
      date_format: Jan 2006
      items:
        - title: Senior Software Engineer
          company: Tech Corp
          company_url: ''
          company_logo: ''
          location: San Francisco, CA
          date_start: '2023-01-01'
          date_end: ''
          description: |2-
            * Lead development of microservices architecture serving 1M+ users
            * Improved API response time by 40% through optimization
            * Mentored team of 5 junior developers
            * Tech stack: React, Node.js, PostgreSQL, AWS
        - title: Full-Stack Developer
          company: Startup Inc
          company_url: ''
          company_logo: ''
          location: Remote
          date_start: '2021-06-01'
          date_end: '2022-12-31'
          description: |2-
            * Built and deployed 3 production applications from scratch
            * Implemented CI/CD pipeline reducing deployment time by 60%
            * Collaborated with design team on UI/UX improvements
            * Tech stack: Next.js, Express, MongoDB, Docker
        - title: Junior Developer
          company: Web Agency
          company_url: ''
          company_logo: ''
          location: New York, NY
          date_start: '2020-01-01'
          date_end: '2021-05-31'
          description: |2-
            * Developed client websites using modern web technologies
            * Maintained and updated legacy codebases
            * Participated in code reviews and agile ceremonies
            * Tech stack: React, WordPress, PHP, MySQL
    design:
      columns: '1'
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # Recent Blog Posts
  - block: collection
    id: blog
    content:
      title: Recent Posts
      subtitle: 'Thoughts on web development, tech, and more'
      text: ''
      filters:
        folders:
          - blog
        exclude_featured: false
      count: 3
      order: desc
    design:
      view: card
      columns: 3
      background:
        color:
          light: "#f5f5f5"
          dark: "#08080c"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # Contact Section
  - block: contact-info
    id: contact
    content:
      title: Contact
      subtitle: "많은 관심 부탁드립니다 😊"
      text: |-
        데이터 분석, AI • LLM, HCI 및 제품 중심 프로젝트에서 협업하고 싶습니다. 관심 있으시면 언제든 연락 부탁드립니다!
      email: thddlsgur0105@khu.ac.kr
      autolink: true
    design:
      columns: '1'
      background:
        color:
          light: "#ffffff"
          dark: "#0d0d12"
      spacing:
        padding: ["4rem", "0", "4rem", "0"]
  
  # CTA Card
  - block: cta-card
    content:
      title: "In Hyuk's CV"
      text: |-
        배움을 목말라하고 항상 겸손하게 배우고 <br/> 이를 통해 더욱 성장하는 것을 지향하며 살고 있습니다.
      button:
        text: 'Download Resume'
        url: uploads/resume.pdf
        new_tab: true
    design:
      card:
        # Light mode: soft pastel theme gradient | Dark mode: rich deep gradient
        css_class: 'bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-200 dark:from-primary-600 dark:via-primary-700 dark:to-secondary-700'
        text_color: dark
      background:
        color:
          light: "#f5f5f5"
          dark: "#08080c"
      spacing:
        padding: ["4rem", "0", "6rem", "0"]
---
