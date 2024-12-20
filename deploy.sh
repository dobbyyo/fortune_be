#!/usr/bin/env bash

# 로그 출력
echo "> Backend 배포 시작"

# 배포할 경로
REPOSITORY=/home/ubuntu/fortune_be
ZIP_FILE=/home/ubuntu/build-be.zip

# 기존 dist 폴더 제거
echo "> 기존 dist 폴더 제거"
rm -rf $REPOSITORY/dist

# 새로운 배포 파일 압축 해제
echo "> 새로운 배포 파일 압축 해제"
unzip $ZIP_FILE -d $REPOSITORY

# PM2 애플리케이션 재시작
echo "> PM2 애플리케이션 재시작"
pm2 reload fortune_be

# 로그 출력
echo "> Backend 배포 완료"
