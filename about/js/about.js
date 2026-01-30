        // 8가지 다른 색상의 SVG 스티커 데이터
        const stickerData = [
            // 1. 보라색 별
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 20 L120 80 L180 80 L135 115 L155 175 L100 140 L45 175 L65 115 L20 80 L80 80 Z' fill='%238800FF' stroke='black' stroke-width='3'/%3E%3C/svg%3E`,
            
            // 2. 노란색 원
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='70' fill='%23CEFF03' stroke='black' stroke-width='3'/%3E%3C/svg%3E`,
            
            // 3. 빨간색 하트
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 170 C 100 170 30 120 30 80 C 30 50 50 30 75 30 C 85 30 95 35 100 45 C 105 35 115 30 125 30 C 150 30 170 50 170 80 C 170 120 100 170 100 170 Z' fill='%23FF6B6B' stroke='black' stroke-width='3'/%3E%3C/svg%3E`,
            
            // 4. 파란색 사각형
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect x='40' y='40' width='120' height='120' rx='15' fill='%234ECDC4' stroke='black' stroke-width='3'/%3E%3C/svg%3E`,
            
            // 5. 초록색 삼각형
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L170 160 L30 160 Z' fill='%2395E1D3' stroke='black' stroke-width='3'/%3E%3C/svg%3E`,
            
            // 6. 주황색 육각형
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 30 L160 65 L160 135 L100 170 L40 135 L40 65 Z' fill='%23FF9F1C' stroke='black' stroke-width='3'/%3E%3C/svg%3E`,
            
            // 7. 분홍색 구름
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M60 100 Q60 70 85 70 Q90 50 110 50 Q130 50 140 70 Q165 70 165 95 Q165 120 140 120 L60 120 Q40 120 40 100 Q40 80 60 80 Z' fill='%23FF6B9D' stroke='black' stroke-width='3'/%3E%3C/svg%3E`,
            
            // 8. 청록색 번개
            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M110 30 L70 100 L100 100 L60 170 L120 90 L90 90 L130 30 Z' fill='%2300DFA2' stroke='black' stroke-width='3'/%3E%3C/svg%3E`
        ];

        let stickerCount = 0;
        const totalStickers = 8;
        let zIndexCounter = 1;

        const aboutSection = document.getElementById('aboutSection');
        const stickerContainer = document.getElementById('stickerContainer');

        // 클릭 이벤트
        aboutSection.addEventListener('click', (e) => {
            addSticker(e.clientX, e.clientY);
        });

        function addSticker(x, y) {
            // 현재 스티커 번호 (0-7 순환)
            const currentSticker = stickerCount % totalStickers;
            
            // 스티커 요소 생성
            const sticker = document.createElement('img');
            sticker.src = stickerData[currentSticker];
            sticker.classList.add('sticker');
            
            // 랜덤 회전 각도 (-30도 ~ 30도)
            const rotation = Math.random() * 60 - 30;
            sticker.style.setProperty('--rotation', `${rotation}deg`);
            
            // 위치 설정 (클릭한 위치 중심, 약간의 랜덤 오프셋)
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            
            sticker.style.left = `${x + offsetX}px`;
            sticker.style.top = `${y + offsetY}px`;
            sticker.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            
            // z-index로 쌓이는 효과
            sticker.style.zIndex = zIndexCounter++;
            
            // 스티커 추가
            stickerContainer.appendChild(sticker);
            
            // 안내 텍스트 숨기기
            if (stickerCount === 0) {
                stickerContainer.classList.add('has-stickers');
            }
            
            // 카운터 증가
            stickerCount++;
            
            console.log(`Sticker ${currentSticker + 1} added!`); // 디버깅용
            
            // 스티커가 너무 많아지면 오래된 것부터 제거
            if (stickerContainer.children.length > 30) {
                stickerContainer.removeChild(stickerContainer.firstChild);
            }
        }

        // 마우스 움직임에 반응하는 효과 (선택사항)
        document.addEventListener('mousemove', (e) => {
            const stickers = document.querySelectorAll('.sticker');
            
            stickers.forEach((sticker) => {
                const rect = sticker.getBoundingClientRect();
                const stickerX = rect.left + rect.width / 2;
                const stickerY = rect.top + rect.height / 2;
                
                const deltaX = e.clientX - stickerX;
                const deltaY = e.clientY - stickerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    const moveX = (deltaX / distance) * force * -8;
                    const moveY = (deltaY / distance) * force * -8;
                    
                    const rotation = sticker.style.getPropertyValue('--rotation');
                    sticker.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotate(${rotation})`;
                } else {
                    const rotation = sticker.style.getPropertyValue('--rotation');
                    sticker.style.transform = `translate(-50%, -50%) rotate(${rotation})`;
                }
            });
        });

        console.log('Sticker page loaded! Click anywhere to add stickers.');