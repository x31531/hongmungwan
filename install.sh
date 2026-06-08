#!/bin/bash

echo ""
echo "M.E.T. 설치 중..."
echo ""

# 1. Homebrew 설치 확인
if ! command -v brew &> /dev/null; then
  echo "Homebrew 설치 중..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || eval "$(/usr/local/bin/brew shellenv)"
fi

# 2. nvm 설치 확인
if ! command -v nvm &> /dev/null; then
  echo "nvm 설치 중..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. Node 20 설치
echo "Node.js 설치 중..."
nvm install 20
nvm use 20

# 4. 앱 폴더 생성
APP_DIR="$HOME/MET"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# 5. GitHub에서 소스 다운로드
echo "앱 다운로드 중..."
curl -L https://github.com/x31531/hongmungwan/archive/refs/heads/main.zip -o met.zip
unzip -o met.zip
cp -r hongmungwan-main/* .
rm -rf hongmungwan-main met.zip

# 6. 패키지 설치 및 빌드
echo "앱 빌드 중..."
npm install
npm run build

# 7. .app 복사
APP_PATH=$(find dist -name "*.app" | head -1)
if [ -n "$APP_PATH" ]; then
  cp -r "$APP_PATH" "$HOME/Applications/" 2>/dev/null || cp -r "$APP_PATH" "/Applications/"
  echo ""
  echo "✓ 설치 완료!"
  echo "  Applications 폴더에서 M.E.T.를 실행하세요."
  echo "  처음 실행 시 우클릭 → 열기 를 눌러주세요."
else
  echo ""
  echo "✓ 다운로드 완료! 다음 명령어로 실행하세요:"
  echo "  cd ~/MET && npm start"
fi
