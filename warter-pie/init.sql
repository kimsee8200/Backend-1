-- PostgreSQL 초기화 스크립트
-- 데이터베이스 생성 (이미 docker-compose에서 생성됨)
-- CREATE DATABASE warter_pie;

-- 사용자 권한 설정
GRANT ALL PRIVILEGES ON DATABASE warter_pie TO postgres;

-- 확장 기능 활성화 (필요시)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 