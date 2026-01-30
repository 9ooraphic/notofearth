// 돌 이미지와 링크 데이터
const stoneData = [
    { image: "./img/stone1.png", title: "퍼플 에메랄드", link: "/stone1.html" },
    { image: "./img/stone2.png", title: "민트 라리마", link: "/stone2.html" },
    { image: "./img/stone3.png", title: "황금 운석", link: "/stone3.html" },
    { image: "./img/stone4.png", title: "회색 대리석", link: "/stone4.html" },
    { image: "./img/stone5.png", title: "아쿠아마린", link: "/stone5.html" },
    { image: "./img/stone6.png", title: "블랙 오닉스", link: "/stone6.html" },
    { image: "./img/stone7.png", title: "화이트 쿼츠", link: "/stone7.html" },
    { image: "./img/stone8.png", title: "라벤더 아메시스트", link: "/stone8.html" },
    { image: "./img/stone9.png", title: "녹색 비취", link: "/stone9.html" },
    { image: "./img/stone10.png", title: "피라밋 오팔", link: "/stone10.html" }
];

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('slider-container');
    const numStones = stoneData.length;
    const stones = [];

    // 현재 중앙에 위치한 돌의 인덱스
    let currentIndex = 0;

    // 드래그 관련 변수
    let isDragging = false;
    let startX = 0;
    let startTranslateX = 0;
    let translateX = 0;
    let velocity = 0;

    // 돌 요소 생성
    stoneData.forEach((data, index) => {
        const stone = createStone(data, index, container);
        stones.push(stone);
    });

    // 초기 위치 설정
    updateStonesPosition();

    // 드래그와 마우스 오버/무브 관련 이벤트 리스너
    let mouseOverContainer = false;
    let autoScrollSpeed = 0;
    let autoScrollInterval;
    const AUTOSCROLL_SPEED = 2.0; // 자동 스크롤 속도 증가 (0.8 -> 2.0)

    container.addEventListener('mousedown', startDrag);
    container.addEventListener('touchstart', e => {
        startDrag(e.touches[0]);
    }, { passive: true });

    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', e => {
        moveDrag(e.touches[0]);
    }, { passive: true });

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag, { passive: true });

    window.addEventListener('resize', updateStonesPosition);

    // 마우스 오버 이벤트 - 슬라이더 영역에 마우스가 있을 때
    container.addEventListener('mouseover', function() {
        mouseOverContainer = true;
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(updateAutoScroll, 16);
    });

    // // 마우스 아웃 이벤트 - 슬라이더 영역에서 마우스가
    // container.addEventListener('mouseout', function() {
    //     mouseOverContainer = false;
    //     autoScrollSpeed = 0; // 자동 스크롤 속도 초기화
    //     if (autoScrollInterval) clearInterval(autoScrollInterval);
    // });
    //
    // // 마우스 이동 시 자동 스크롤 속도 계산
    // container.addEventListener('mousemove', function(e) {
    //     if (!mouseOverContainer || isDragging) return;
    //
    //     const rect = container.getBoundingClientRect();
    //     const centerX = rect.left + rect.width / 2;
    //     const mouseX = e.clientX;
    //
    //     // 마우스 위치에 따라 스크롤 속도 결정 (중앙에서 멀수록 빠름)
    //     const distanceFromCenter = mouseX - centerX;
    //     autoScrollSpeed = (distanceFromCenter / (rect.width / 2)) * AUTOSCROLL_SPEED;
    // });
    //
    // // 자동 스크롤 업데이트 함수
    // function updateAutoScroll() {
    //     if (isDragging) return;
    //
    //     if (autoScrollSpeed !== 0) {
    //         translateX += autoScrollSpeed * 10;
    //
    //         // 무한 루프 처리
    //         const itemWidth = 500;
    //
    //         // 양쪽 끝에 도달했을 때 반대쪽으로 이동
    //         if (translateX > itemWidth) {
    //             translateX -= numStones * itemWidth;
    //         } else if (translateX < -(numStones * itemWidth) + itemWidth) {
    //             translateX += numStones * itemWidth;
    //         }
    //
    //         updateStonesPosition();
    //     }
    // }

    // 드래그 시작
    function startDrag(e) {
        isDragging = true;
        startX = e.clientX;
        startTranslateX = translateX;
        container.style.cursor = 'grabbing';

        // 트랜지션 제거하여 드래그 중 부드럽게
        stones.forEach(stone => {
            stone.style.transition = 'none';
        });
    }

    // 드래그 중
    function moveDrag(e) {
        if (!isDragging) return;

        const currentX = e.clientX;
        const deltaX = currentX - startX;

        // 이전 프레임과의 위치 차이를 이용한 속도 계산
        velocity = (currentX - (lastX || currentX)) * 0.8; // 감도 증가 (0.1 -> 0.8)
        lastX = currentX;

        // translateX 값 업데이트 (드래그 저항 감소로 더 민감하게)
        translateX = startTranslateX + deltaX * 1.5; // 저항 감소 (0.8 -> 1.5)

        // 위치 업데이트
        updateStonesPosition();
    }

    // 드래그 종료
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'default';
        lastX = null;

        // 관성 효과 진행 중 멈춤
        if (inertiaAnimation) {
            cancelAnimationFrame(inertiaAnimation);
        }

        // 가장 가까운 돌을 중앙으로 가져오는 계산
        const itemWidth = 300; // 아이템 간 간격 변경 (500 -> 300)
        const offset = translateX % itemWidth;
        let snapTranslateX;

        // 속도에 따른 관성 효과 (빠르게 드래그하면 여러 슬라이드 이동)
        const momentumDistance = velocity * 15; // 관성 효과 증가 (10 -> 15)
        const totalMovement = offset + momentumDistance;

        // 드래그 방향과 속도에 따라 스냅 위치 결정
        if (Math.abs(velocity) > 3) { // 민감도 증가 (5 -> 3)
            // 빠른 드래그일 경우 관성으로 다음/이전 아이템으로 이동
            const direction = velocity < 0 ? -1 : 1;
            const moveCount = Math.min(3, Math.max(1, Math.floor(Math.abs(velocity) / 5)));
            snapTranslateX = translateX - offset + (direction * itemWidth * moveCount);
        } else if (Math.abs(offset) > itemWidth / 3) { // 임계값 조정 (1/2 -> 1/3)
            // 일정 이상 드래그했으면 다음/이전 아이템으로 이동
            snapTranslateX = translateX - offset + (offset < 0 ? -itemWidth : itemWidth);
        } else {
            // 그렇지 않으면 원래 위치로 복귀
            snapTranslateX = translateX - offset;
        }

        // 범위 제한
        const maxTranslateX = 0;
        const minTranslateX = -((numStones - 1) * itemWidth);
        snapTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, snapTranslateX));

        // 현재 인덱스 업데이트
        currentIndex = Math.round(Math.abs(snapTranslateX) / itemWidth);

        // 관성 애니메이션 적용
        applyInertia(snapTranslateX);

        // 트랜지션 다시 추가
        stones.forEach(stone => {
            stone.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        });
    }

    let inertiaAnimation;
    let lastX = null;

    // 관성 애니메이션 적용 함수
    function applyInertia(targetTranslateX) {
        const startTime = Date.now();
        const startTranslateX = translateX;
        const duration = 800; // 애니메이션 지속 시간

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);

            // 이징 함수 적용 (부드러운 감속)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3); // 더 부드러운 이징 함수
            translateX = startTranslateX + (targetTranslateX - startTranslateX) * easeOutCubic;

            updateStonesPosition();

            if (progress < 1) {
                inertiaAnimation = requestAnimationFrame(animate);
            } else {
                // 애니메이션 종료 후 가장 가까운 인덱스로 정확히 조정
                translateX = -currentIndex * 300; // 아이템 간 간격 변경 (500 -> 300)
                updateStonesPosition();
                inertiaAnimation = null;
            }
        }

        animate();
    }

    // 초기화 시 첫 번째 아이템이 정확히 중앙에 오도록 조정
    translateX = 0;
    updateStonesPosition();

    // 돌 위치 업데이트 함수 - 실제 FFF 사이트와 유사한 2D 슬라이드 효과
    function updateStonesPosition() {
        const maxVisible = 7; // 화면에 보이는 최대 돌 개수 증가 (5 -> 7)
        const itemWidth = 300; // 아이템 간 간격 감소 (500 -> 300) - 더 많은 아이템이 보이도록

        // 무한 루프를 위한 인덱스 조정 - 양쪽 끝에 도달했을 때 반대쪽으로 시각적 변화 없이 이동
        if (translateX > itemWidth) {
            translateX -= numStones * itemWidth;
        } else if (translateX < -(numStones * itemWidth) + itemWidth) {
            translateX += numStones * itemWidth;
        }

        stones.forEach((stone, index) => {
            // 기준 위치 (translateX 값에 따라 변화)
            const basePosition = index * itemWidth + translateX;

            // 무한 루프를 위한 추가 요소 렌더링
            const renderPositions = [
                basePosition, // 기본 위치
                basePosition + numStones * itemWidth, // 왼쪽 루프용 (돌이 오른쪽 끝에서 왼쪽으로 넘어올 때)
                basePosition - numStones * itemWidth  // 오른쪽 루프용 (돌이 왼쪽 끝에서 오른쪽으로 넘어올 때)
            ];

            // 모든 가능한 위치 중 화면에 보이는 위치가 있는지 확인
            let visiblePosition = null;
            for (const pos of renderPositions) {
                if (Math.abs(pos) < maxVisible * 120) { // 가시 범위 조정
                    visiblePosition = pos;
                    break;
                }
            }

            // 화면에 보이지 않는 경우
            if (visiblePosition === null) {
                stone.style.display = 'none';
                return;
            } else {
                stone.style.display = 'block';
            }

            // 화면 중앙으로부터의 거리
            const distance = visiblePosition;

            // 중앙으로부터의 거리에 따른 스케일, 회전, 깊이 계산
            const absDistance = Math.abs(distance);
            const scale = 1.3 - (absDistance * 0.0015); // 감소 비율 조정
            const rotateY = distance * 0.08; // 회전
            const translateZ = -absDistance * 0.3; // Z축 깊이
            const opacity = Math.max(0.6, 1 - (absDistance * 0.0005)); // 투명도

            // 트랜스폼 적용
            stone.style.transform = `
                translateX(${distance}px)
                translateZ(${translateZ}px)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;
            stone.style.opacity = opacity;
            stone.style.zIndex = 100 - Math.abs(distance);

            // 현재 중앙에 있는 돌에 active 클래스 적용
            if (Math.abs(distance) < 50) { // 범위 조정 (80 -> 50)
                stone.classList.add('active');
            } else {
                stone.classList.remove('active');
            }
        });
    }
});

// 돌 요소 생성 함수
function createStone(stoneData, index, container) {
    const stone = document.createElement('div');
    stone.className = 'stone';
    stone.setAttribute('data-index', index);

    // 이미지 생성
    const img = document.createElement('img');
    img.src = stoneData.image;
    img.alt = stoneData.title;
    stone.appendChild(img);

    // 클릭 이벤트 - 링크로 이동
    stone.addEventListener('click', function(e) {
        // active 클래스가 있는 경우에만 링크로 이동 (중앙에 있는 경우)
        if (stone.classList.contains('active')) {
            window.location.href = stoneData.link;
        } else {
            // 중앙에 없는 돌을 클릭하면 이벤트 전파 차단
            e.stopPropagation();
            e.preventDefault();
        }
    });

    container.appendChild(stone);
    return stone;
}
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const container = document.getElementById('background-container');
    const infoText = document.getElementById('background-info');
    let clickCount = 0;

    // WebP 이미지 경로 배열 (실제 이미지 경로로 변경해주세요)
    const webpImages = [
        './img/background1.webp',
        './img/background2.webp',
        './img/background3.webp',
        './img/background4.webp',
        './img/background5.webp'
    ];

    // 전체 문서에 클릭 이벤트 리스너 추가
    document.addEventListener('click', function() {
        clickCount++;
        updateBackground();
    });

    // 배경 업데이트 함수
    function updateBackground() {
        const totalStates = 6; // 그라디언트 1개 + 이미지 5개
        const currentState = clickCount % totalStates;

        if (currentState === 0) {
            // 그라디언트 배경 - body의 기본 background 사용
            container.style.backgroundImage = 'none';
            body.style.background = 'radial-gradient(circle at center 30%, #CEFF03 0%, #8800FF 35%)';
            infoText.textContent = '현재 배경: 그라디언트';
        } else {
            // WebP 이미지 배경
            container.style.backgroundImage = `url('${webpImages[currentState-1]}')`;
            // body의 배경이 이미지로 가려지도록 함
            infoText.textContent = `현재 배경: WebP 이미지 ${currentState}/5`;
        }
    }
});

        // // 돌 이미지와 링크 데이터
        // const stoneData = [
        //     { image: "./img/stone1.png", title: "퍼플 에메랄드", link: "/stone1.html" },
        //     { image: "./img/stone2.png", title: "민트 라리마", link: "/stone2.html" },
        //     { image: "./img/stone3.png", title: "황금 운석", link: "/stone3.html" },
        //     { image: "./img/stone4.png", title: "회색 대리석", link: "/stone4.html" },
        //     { image: "./img/stone5.png", title: "아쿠아마린", link: "/stone5.html" },
        //     { image: "./img/stone6.png", title: "블랙 오닉스", link: "/stone6.html" },
        //     { image: "./img/stone7.png", title: "화이트 쿼츠", link: "/stone7.html" },
        //     { image: "./img/stone8.png", title: "라벤더 아메시스트", link: "/stone8.html" },
        //     { image: "./img/stone9.png", title: "녹색 비취", link: "/stone9.html" },
        //     { image: "./img/stone10.png", title: "피라밋 오팔", link: "/stone10.html" }
        // ];

        // document.addEventListener('DOMContentLoaded', function() {
        //     const container = document.getElementById('slider-container');
        //     const numStones = stoneData.length;
        //     const stones = [];
            
        //     // 현재 중앙에 위치한 돌의 인덱스
        //     let currentIndex = 0;
            
        //     // 드래그 관련 변수
        //     let isDragging = false;
        //     let startX = 0;
        //     let startTranslateX = 0;
        //     let translateX = 0;
        //     let velocity = 0;
            
        //     // 돌 요소 생성
        //     stoneData.forEach((data, index) => {
        //         const stone = createStone(data, index, container);
        //         stones.push(stone);
        //     });
            
        //     // 초기 위치 설정
        //     updateStonesPosition();
            
        //     // 드래그와 마우스 오버/무브 관련 이벤트 리스너
        //     let mouseOverContainer = false;
        //     let autoScrollSpeed = 0;
        //     let autoScrollInterval;
        //     const AUTOSCROLL_SPEED = 2.0; // 자동 스크롤 속도 증가 (0.8 -> 2.0)

        //     container.addEventListener('mousedown', startDrag);
        //     container.addEventListener('touchstart', e => {
        //         startDrag(e.touches[0]);
        //     }, { passive: true });
            
        //     window.addEventListener('mousemove', moveDrag);
        //     window.addEventListener('touchmove', e => {
        //         moveDrag(e.touches[0]);
        //     }, { passive: true });
            
        //     window.addEventListener('mouseup', endDrag);
        //     window.addEventListener('touchend', endDrag, { passive: true });
            
        //     window.addEventListener('resize', updateStonesPosition);
            
        //     // 마우스 오버 이벤트 - 슬라이더 영역에 마우스가 있을 때
        //     container.addEventListener('mouseover', function() {
        //         mouseOverContainer = true;
        //         if (autoScrollInterval) clearInterval(autoScrollInterval);
        //         autoScrollInterval = setInterval(updateAutoScroll, 16);
        //     });
            
        //     // 마우스 아웃 이벤트 - 슬라이더 영역에서 마우스가
        //     container.addEventListener('mouseout', function() {
        //         mouseOverContainer = false;
        //         autoScrollSpeed = 0; // 자동 스크롤 속도 초기화
        //         if (autoScrollInterval) clearInterval(autoScrollInterval);
        //     });
            
        //     // 마우스 이동 시 자동 스크롤 속도 계산
        //     container.addEventListener('mousemove', function(e) {
        //         if (!mouseOverContainer || isDragging) return;
                
        //         const rect = container.getBoundingClientRect();
        //         const centerX = rect.left + rect.width / 2;
        //         const mouseX = e.clientX;
                
        //         // 마우스 위치에 따라 스크롤 속도 결정 (중앙에서 멀수록 빠름)
        //         const distanceFromCenter = mouseX - centerX;
        //         autoScrollSpeed = (distanceFromCenter / (rect.width / 2)) * AUTOSCROLL_SPEED;
        //     });
            
        //     // 자동 스크롤 업데이트 함수
        //     function updateAutoScroll() {
        //         if (isDragging) return;
                
        //         if (autoScrollSpeed !== 0) {
        //             translateX += autoScrollSpeed * 10;
                    
        //             // 무한 루프 처리
        //             const itemWidth = 500;
                    
        //             // 양쪽 끝에 도달했을 때 반대쪽으로 이동
        //             if (translateX > itemWidth) {
        //                 translateX -= numStones * itemWidth;
        //             } else if (translateX < -(numStones * itemWidth) + itemWidth) {
        //                 translateX += numStones * itemWidth;
        //             }
                    
        //             updateStonesPosition();
        //         }
        //     }
            
            
        //     // 드래그 시작
        //     function startDrag(e) {
        //         isDragging = true;
        //         startX = e.clientX;
        //         startTranslateX = translateX;
        //         container.style.cursor = 'grabbing';
                
        //         // 트랜지션 제거하여 드래그 중 부드럽게
        //         stones.forEach(stone => {
        //             stone.style.transition = 'none';
        //         });
        //     }
            
        //     // 드래그 중
        //     function moveDrag(e) {
        //         if (!isDragging) return;
                
        //         const currentX = e.clientX;
        //         const deltaX = currentX - startX;
                
        //         // 이전 프레임과의 위치 차이를 이용한 속도 계산
        //         velocity = (currentX - (lastX || currentX)) * 0.8; // 감도 증가 (0.1 -> 0.8)
        //         lastX = currentX;
                
        //         // translateX 값 업데이트 (드래그 저항 감소로 더 민감하게)
        //         translateX = startTranslateX + deltaX * 1.5; // 저항 감소 (0.8 -> 1.5)
                
        //         // 위치 업데이트
        //         updateStonesPosition();
        //     }
            
        //     // 드래그 종료
        //     function endDrag() {
        //         if (!isDragging) return;
        //         isDragging = false;
        //         container.style.cursor = 'default';
        //         lastX = null;
                
        //         // 관성 효과 진행 중 멈춤
        //         if (inertiaAnimation) {
        //             cancelAnimationFrame(inertiaAnimation);
        //         }
                
        //         // 가장 가까운 돌을 중앙으로 가져오는 계산
        //         const itemWidth = 300; // 아이템 간 간격 변경 (500 -> 300)
        //         const offset = translateX % itemWidth;
        //         let snapTranslateX;
                
        //         // 속도에 따른 관성 효과 (빠르게 드래그하면 여러 슬라이드 이동)
        //         const momentumDistance = velocity * 15; // 관성 효과 증가 (10 -> 15)
        //         const totalMovement = offset + momentumDistance;
                
        //         // 드래그 방향과 속도에 따라 스냅 위치 결정
        //         if (Math.abs(velocity) > 3) { // 민감도 증가 (5 -> 3)
        //             // 빠른 드래그일 경우 관성으로 다음/이전 아이템으로 이동
        //             const direction = velocity < 0 ? -1 : 1;
        //             const moveCount = Math.min(3, Math.max(1, Math.floor(Math.abs(velocity) / 5)));
        //             snapTranslateX = translateX - offset + (direction * itemWidth * moveCount);
        //         } else if (Math.abs(offset) > itemWidth / 3) { // 임계값 조정 (1/2 -> 1/3)
        //             // 일정 이상 드래그했으면 다음/이전 아이템으로 이동
        //             snapTranslateX = translateX - offset + (offset < 0 ? -itemWidth : itemWidth);
        //         } else {
        //             // 그렇지 않으면 원래 위치로 복귀
        //             snapTranslateX = translateX - offset;
        //         }
                
        //         // 범위 제한
        //         const maxTranslateX = 0;
        //         const minTranslateX = -((numStones - 1) * itemWidth);
        //         snapTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, snapTranslateX));
                
        //         // 현재 인덱스 업데이트
        //         currentIndex = Math.round(Math.abs(snapTranslateX) / itemWidth);
                
        //         // 관성 애니메이션 적용
        //         applyInertia(snapTranslateX);
                
        //         // 트랜지션 다시 추가
        //         stones.forEach(stone => {
        //             stone.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        //         });
        //     }
            
        //     let inertiaAnimation;
        //     let lastX = null;
            
        //     // 관성 애니메이션 적용 함수
        //     function applyInertia(targetTranslateX) {
        //         const startTime = Date.now();
        //         const startTranslateX = translateX;
        //         const duration = 800; // 애니메이션 지속 시간
                
        //         function animate() {
        //             const elapsed = Date.now() - startTime;
        //             const progress = Math.min(1, elapsed / duration);
                    
        //             // 이징 함수 적용 (부드러운 감속)
        //             const easeOutCubic = 1 - Math.pow(1 - progress, 3); // 더 부드러운 이징 함수
        //             translateX = startTranslateX + (targetTranslateX - startTranslateX) * easeOutCubic;
                    
        //             updateStonesPosition();
                    
        //             if (progress < 1) {
        //                 inertiaAnimation = requestAnimationFrame(animate);
        //             } else {
        //                 // 애니메이션 종료 후 가장 가까운 인덱스로 정확히 조정
        //                 translateX = -currentIndex * 300; // 아이템 간 간격 변경 (500 -> 300)
        //                 updateStonesPosition();
        //                 inertiaAnimation = null;
        //             }
        //         }
                
        //         animate();
        //     }
            
        //     // 초기화 시 첫 번째 아이템이 정확히 중앙에 오도록 조정
        //     translateX = 0;
        //     updateStonesPosition();
            
        //     // 돌 위치 업데이트 함수 - 실제 FFF 사이트와 유사한 2D 슬라이드 효과
        //     function updateStonesPosition() {
        //         const maxVisible = 7; // 화면에 보이는 최대 돌 개수 증가 (5 -> 7)
        //         const itemWidth = 300; // 아이템 간 간격 감소 (500 -> 300) - 더 많은 아이템이 보이도록
                
        //         // 무한 루프를 위한 인덱스 조정 - 양쪽 끝에 도달했을 때 반대쪽으로 시각적 변화 없이 이동
        //         if (translateX > itemWidth) {
        //             translateX -= numStones * itemWidth;
        //         } else if (translateX < -(numStones * itemWidth) + itemWidth) {
        //             translateX += numStones * itemWidth;
        //         }
                
        //         stones.forEach((stone, index) => {
        //             // 기준 위치 (translateX 값에 따라 변화)
        //             const basePosition = index * itemWidth + translateX;
                    
        //             // 무한 루프를 위한 추가 요소 렌더링
        //             const renderPositions = [
        //                 basePosition, // 기본 위치
        //                 basePosition + numStones * itemWidth, // 왼쪽 루프용 (돌이 오른쪽 끝에서 왼쪽으로 넘어올 때)
        //                 basePosition - numStones * itemWidth  // 오른쪽 루프용 (돌이 왼쪽 끝에서 오른쪽으로 넘어올 때)
        //             ];
                    
        //             // 모든 가능한 위치 중 화면에 보이는 위치가 있는지 확인
        //             let visiblePosition = null;
        //             for (const pos of renderPositions) {
        //                 if (Math.abs(pos) < maxVisible * 120) { // 가시 범위 조정
        //                     visiblePosition = pos;
        //                     break;
        //                 }
        //             }
                    
        //             // 화면에 보이지 않는 경우
        //             if (visiblePosition === null) {
        //                 stone.style.display = 'none';
        //                 return;
        //             } else {
        //                 stone.style.display = 'block';
        //             }
                    
        //             // 화면 중앙으로부터의 거리
        //             const distance = visiblePosition;
                    
        //             // 중앙으로부터의 거리에 따른 스케일, 회전, 깊이 계산
        //             const absDistance = Math.abs(distance);
        //             const scale = 1.3 - (absDistance * 0.0015); // 감소 비율 조정
        //             const rotateY = distance * 0.08; // 회전
        //             const translateZ = -absDistance * 0.3; // Z축 깊이
        //             const opacity = Math.max(0.6, 1 - (absDistance * 0.0005)); // 투명도
                    
        //             // 트랜스폼 적용
        //             stone.style.transform = `
        //                 translateX(${distance}px)
        //                 translateZ(${translateZ}px)
        //                 rotateY(${rotateY}deg)
        //                 scale(${scale})
        //             `;
        //             stone.style.opacity = opacity;
        //             stone.style.zIndex = 100 - Math.abs(distance);
                    
        //             // 현재 중앙에 있는 돌에 active 클래스 적용
        //             if (Math.abs(distance) < 200) { // 범위 조정 (80 -> 50)
        //                 stone.classList.add('active');
        //             } else {
        //                 stone.classList.remove('active');
        //             }
        //         });
        //     }
        // });

        // // 돌 요소 생성 함수
        // function createStone(stoneData, index, container) {
        //     const stone = document.createElement('div');
        //     stone.className = 'stone';
        //     stone.setAttribute('data-index', index);
            
        //     // 이미지 생성
        //     const img = document.createElement('img');
        //     img.src = stoneData.image;
        //     img.alt = stoneData.title;
        //     stone.appendChild(img);
            
        //     // 클릭 이벤트 - 링크로 이동
        //     stone.addEventListener('click', function(e) {
        //         // active 클래스가 있는 경우에만 링크로 이동 (중앙에 있는 경우)
        //         if (stone.classList.contains('active')) {
        //             window.location.href = stoneData.link;
        //         } else {
        //             // 중앙에 없는 돌을 클릭하면 이벤트 전파 차단
        //             e.stopPropagation();
        //             e.preventDefault();
        //         }
        //     });
            
        //     container.appendChild(stone);
        //     return stone;
        // }
        // document.addEventListener('DOMContentLoaded', function() {
        //     const body = document.body;
        //     const container = document.getElementById('background-container');
        //     const infoText = document.getElementById('background-info');
        //     let clickCount = 0;
            
        //     // WebP 이미지 경로 배열 (실제 이미지 경로로 변경해주세요)
        //     const webpImages = [
        //         './img/background1.webp',
        //         './img/background2.webp',
        //         './img/background3.webp', 
        //         './img/background4.webp',
        //         './img/background5.webp'
        //     ];
            
        //     // 전체 문서에 클릭 이벤트 리스너 추가
        //     document.addEventListener('click', function() {
        //         clickCount++;
        //         updateBackground();
        //     });
            
        //     // 배경 업데이트 함수
        //     function updateBackground() {
        //         const totalStates = 6; // 그라디언트 1개 + 이미지 5개
        //         const currentState = clickCount % totalStates;
                
        //         if (currentState === 0) {
        //             // 그라디언트 배경 - body의 기본 background 사용
        //             container.style.backgroundImage = 'none';
        //             body.style.background = 'radial-gradient(circle at center 30%, #CEFF03 0%, #8800FF 35%)';
        //             infoText.textContent = '현재 배경: 그라디언트';
        //         } else {
        //             // WebP 이미지 배경
        //             container.style.backgroundImage = `url('${webpImages[currentState-1]}')`;
        //             // body의 배경이 이미지로 가려지도록 함
        //             infoText.textContent = `현재 배경: WebP 이미지 ${currentState}/5`;
        //         }
        //     }
        // });
        