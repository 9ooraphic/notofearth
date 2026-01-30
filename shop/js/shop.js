        // 전역 변수
        let scene, camera, renderer, controls;
        let sphereGeometry, sphereMaterial, sphere;
        let stones = [];
        let mouse = new THREE.Vector2();
        let raycaster = new THREE.Raycaster();
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let currentStone = null;
        let tooltipTimeout = null;
        let isTooltipHovered = false;
        let gltfLoader; // GLTFLoader 추가
        
        // 상세 모달용 3D 뷰어 변수들
        let detailScene, detailCamera, detailRenderer;
        let detailModel = null;
        let detailControls = {
            isDragging: false,
            previousMouse: { x: 0, y: 0 }
        };

        // 제품 데이터
        const stoneData = [
            {
                name: "CHONDRITE",
                description: "빛나는 물의의 고대 광물이자 맞아어 나는 크리에이티브 문석.",
                descriptionEn: "The Corilite meteorite is a rare mineral object that was ejected into space thousands of years ago from the 'Erunos Crater,' formed by a massive meteorite impact on the planet Veltanis.",
                descriptionKo: "코릴라이트 운석은 수천 년 전 벨타니스 행성의 거대한 유성 충돌로 형성된 에루노스 충돌구에서 분리되어 우주로 발사된 희귀 광물체다. 이 운석은 외부는 초록빛 수정 결정으로 덮여 있으며, 내부에는 미세한 유기물 흔적과 외계 미생물 화석이 발견된다.",
                price: "₩300,000",
                position: { x: -15, y: 5, z: -10 },
                color: 0x4a5d4a,
                size: 2,
                modelPath: "shop/models/chondrite.glb", // GLB 파일 경로
                image: "images/chondrite.png"
            },
            {
                name: "GOLDEN ASTEROID",
                description: "우주의 깊은 곳에서 발견된 신비로운 황금빛 광물.",
                descriptionEn: "A mysterious golden mineral discovered in the depths of space, containing rare elements from distant galaxies.",
                descriptionKo: "우주의 깊은 곳에서 발견된 신비로운 황금빛 광물로, 먼 은하계의 희귀 원소들을 포함하고 있습니다. 높은 에너지를 방출하며 독특한 진동을 발생시킵니다.",
                price: "₩500,000",
                position: { x: 20, y: 8, z: -15 },
                color: 0xFFD700,
                size: 2.5,
                modelPath: "shop/models/stone1.glb",
                image: "images/golden-asteroid.png"
            },
            {
                name: "GREY STONE",
                description: "순수한 회색 광물로 균형과 조화를 상징합니다.",
                descriptionEn: "A pure grey mineral symbolizing balance and harmony from the ancient cosmic winds.",
                descriptionKo: "고대 우주 바람에서 형성된 순수한 회색 광물로 균형과 조화를 상징합니다. 명상과 집중에 도움을 주는 신비로운 에너지를 발산합니다.",
                price: "₩250,000",
                position: { x: 0, y: -3, z: -20 },
                color: 0x888888,
                size: 3,
                modelPath: "shop/models/stone4.glb",
                image: "images/grey-stone.png"
            },
            {
                name: "BLUE CRYSTAL",
                description: "파란 빛이 신비로운 심해의 보석.",
                descriptionEn: "A mysterious blue gem from the deep ocean of space, containing the essence of cosmic waters.",
                descriptionKo: "우주 심해에서 발견된 파란 빛이 신비로운 보석으로, 우주 바다의 정수를 담고 있습니다. 평온함과 지혜를 상징하는 신성한 광물입니다.",
                price: "₩450,000",
                position: { x: -10, y: -15, z: 5 },
                color: 0x4169E1,
                size: 2.2,
                modelPath: "shop/models/blue-crystal.glb",
                image: "images/blue-crystal.png"
            },
            {
                name: "HC-417 Blue Phase Crystal",
                description: "저온 진공 환경에서 안정화된 푸른 결정 구조.",
                descriptionEn: "A blue-phase crystalline structure stabilized under extreme vacuum and low-temperature conditions.",
                descriptionKo: "극저온 진공 환경에서 안정화된 푸른 상의 결정 구조로, 미세한 격자 배열이 특징입니다. 현재까지 인공 합성은 확인되지 않았습니다.",
                price: "₩450,000",
                position: { x: 14, y: 9, z: -18 },
                color: 0x4169E1,
                size: 2.2,
                modelPath: "shop/models/hc-417.glb",
                image: "images/hc-417.png"
            },
            {
                name: "LRS-09 Silicate Core",
                description: "심우주 운석 내부에서 채취된 규산염 결정.",
                descriptionEn: "A silicate-based crystal extracted from the inner layer of a deep-space meteorite.",
                descriptionKo: "심우주에서 회수된 운석의 내부 층에서 채취된 규산염 기반 결정으로, 비정상적으로 높은 밀도를 보입니다.",
                price: "₩390,000",
                position: { x: -22, y: 6, z: -4 },
                color: 0x9FA8DA,
                size: 2.0,
                modelPath: "shop/models/lrs-09.glb",
                image: "images/lrs-09.png"
             },
            {   
                name: "Astra-β Crystalline Sample",
                description: "미세 중력 환경에서 형성된 결정 샘플.",
                descriptionEn: "A crystalline sample formed in a prolonged microgravity environment.",
                descriptionKo: "장기간 미세 중력 환경에서 형성된 것으로 분석된 결정 샘플입니다. 지구상의 결정 성장 패턴과는 다른 방향성을 보입니다.",
                price: "₩420,000",
                position: { x: 4, y: 21, z: -27 },
                color: 0x90CAF9,
                size: 2.1,
                modelPath: "shop/models/astra-beta.glb",
                image: "images/astra-beta.png"
            },
            {
                name: "VTX-001 Dark Matrix",
                description: "광흡수율이 높은 비정질 결정.",
                descriptionEn: "An amorphous crystal exhibiting unusually high light absorption.",
                descriptionKo: "비정질 구조를 가지며 가시광선 영역에서 높은 흡수율을 보이는 결정입니다. 자연 발생 경로는 아직 규명되지 않았습니다.",
                price: "₩610,000",
                position: { x: 19, y: -24, z: 11 },
                color: 0x2E2E3A,
                size: 2.4,
                modelPath: "shop/models/vtx-001.glb",
                image: "images/vtx-001.png"
            },
            {
                name: "SOL-23 Fused Crystal",
                description: "고에너지 방사 환경에서 융합된 결정체.",
                descriptionEn: "A fused crystal formed under sustained high-energy radiation exposure.",
                descriptionKo: "고에너지 방사선 환경에서 장시간 노출되어 형성된 융합 결정체로, 표면에 열 변형 흔적이 관찰됩니다.",
                price: "₩480,000",
                position: { x: -31, y: -3, z: 15 },
                color: 0xFFD54F,
                size: 2.3,
                modelPath: "shop/models/sol-23.glb",
                image: "images/sol-23.png"
            },
            {
                name: "NBL-77 Opaline Structure",
                description: "성운 물질에서 기원한 유백색 결정.",
                descriptionEn: "An opaline crystal structure believed to originate from nebular material.",
                descriptionKo: "성운 기원 물질에서 형성된 것으로 추정되는 유백색 결정 구조입니다. 내부 산란 현상이 특징적으로 관측됩니다.",
                price: "₩370,000",
                position: { x: 7, y: 33, z: 4 },
                color: 0xECEFF1,
                size: 1.9,
                modelPath: "shop/models/nbl-77.glb",
                image: "images/nbl-77.png"
            },
            {
                name: "ADS-204 Pressure Crystal",
                description: "극고압 환경에서 안정화된 결정.",
                descriptionEn: "A crystal stabilized under extreme pressure conditions beyond terrestrial limits.",
                descriptionKo: "지구 기준을 초과하는 극고압 환경에서 안정화된 결정으로, 구조 붕괴 없이 형태를 유지하고 있습니다.",
                price: "₩550,000",
                position: { x: 26, y: -12, z: -29 },
                color: 0x1E88E5,
                size: 2.2,
                modelPath: "shop/models/stone4.glb",
                image: "images/ads-204.png"
            },
            {
                name: "CRX-5 Frozen Lattice",
                description: "우주 공간에서 급속 냉각된 결정 격자.",
                descriptionEn: "A crystal lattice rapidly cooled in open space conditions.",
                descriptionKo: "우주 공간에서 급속 냉각되어 형성된 결정 격자로, 열 이력 분석 결과 비지구적 냉각 패턴을 보입니다.",
                price: "₩430,000",
                position: { x: -38, y: -20, z: -2 },
                color: 0xB3E5FC,
                size: 2.0,
                modelPath: "shop/models/stone4.glb",
                image: "images/crx-5.png"
            }
        ];

        function init() {
            // 씬 생성
            scene = new THREE.Scene();

            // 카메라 생성
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 0);

            // 렌더러 생성
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000);
            document.getElementById('container').appendChild(renderer.domElement);

            // GLTF 로더 초기화
            gltfLoader = new THREE.GLTFLoader();

            // 우주 배경 구 생성
            createSpaceSphere();
            
            // 돌들 생성 (GLB 모델로)
            createStones();

            // 조명 추가
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0xffffff, 0.8);
            pointLight.position.set(10, 10, 10);
            scene.add(pointLight);

            // 이벤트 리스너 추가
            addEventListeners();

            // ESC 키로 모달 닫기
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    closeDetailModal();
                }
            });

            // 모달 외부 클릭으로 닫기
            document.getElementById('detailModal').addEventListener('click', (event) => {
                if (event.target.id === 'detailModal') {
                    closeDetailModal();
                }
            });

            // 로딩 완료
            document.getElementById('loading').classList.add('hidden');

            // 렌더링 시작
            animate();
        }

        function createSpaceSphere() {
            // 큰 구를 만들어서 내부에 우주 텍스처 적용
            sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
            
            // 실제 우주 이미지 로드
            const textureLoader = new THREE.TextureLoader();
            
            // 실제 360도 우주 이미지 경로 (여기에 실제 이미지 경로를 넣으세요)
            const spaceImagePath = 'shop/img/space14.png'; // 실제 이미지 경로로 변경
            
            // 로딩 에러 처리와 함께 텍스처 로드
            textureLoader.load(
                spaceImagePath,
                // 성공시 콜백
                function(texture) {
                    console.log('우주 이미지 로드 성공');
                    
                    // 360도 이미지를 위한 설정
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.repeat.set(-1, 1); // X축 반전 (내부에서 보기 위해)
                    
                    // 경계선 문제 해결을 위한 필터링
                    texture.magFilter = THREE.LinearFilter;
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                    texture.generateMipmaps = true;
                    
                    sphereMaterial = new THREE.MeshBasicMaterial({ 
                        map: texture, 
                        side: THREE.BackSide // 구의 내부면에 텍스처 적용
                    });
                    
                    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    scene.add(sphere);
                },
                // 로딩 중 콜백
                function(progress) {
                    console.log('로딩 진행률:', (progress.loaded / progress.total * 100) + '%');
                },
                // 에러 콜백 - 실제 이미지가 없을 때 대체 이미지 생성
                function(error) {
                    console.warn('우주 이미지 로드 실패, 대체 이미지 생성:', error);
                    createFallbackSpaceTexture();
                }
            );
        }

        function createFallbackSpaceTexture() {
            // 실제 이미지 로드 실패시 대체 텍스처 생성
            const canvas = document.createElement('canvas');
            canvas.width = 4096;  // 고해상도
            canvas.height = 2048; // 2:1 비율
            const ctx = canvas.getContext('2d');
            
            // 우주 배경 그라디언트 생성
            const gradient = ctx.createRadialGradient(2048, 1024, 0, 2048, 1024, 2048);
            gradient.addColorStop(0, '#4a0080');
            gradient.addColorStop(0.3, '#1a0040');
            gradient.addColorStop(0.7, '#0d001a');
            gradient.addColorStop(1, '#000000');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 4096, 2048);
            
            // 별들 추가
            ctx.fillStyle = 'white';
            for (let i = 0; i < 3000; i++) {
                const x = Math.random() * 4096;
                const y = Math.random() * 2048;
                const size = Math.random() * 3;
                const brightness = Math.random();
                
                ctx.globalAlpha = brightness;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 성운 효과 추가
            ctx.globalAlpha = 0.3;
            for (let i = 0; i < 10; i++) {
                const x = Math.random() * 4096;
                const y = Math.random() * 2048;
                const radius = 100 + Math.random() * 200;
                
                const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                nebulaGradient.addColorStop(0, `hsl(${Math.random() * 60 + 240}, 70%, 50%)`);
                nebulaGradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = nebulaGradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(-1, 1);
            
            sphereMaterial = new THREE.MeshBasicMaterial({ 
                map: texture, 
                side: THREE.BackSide 
            });
            
            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            scene.add(sphere);
        }

        function createStones() {
            let loadedCount = 0;
            const totalCount = stoneData.length;

            stoneData.forEach((data, index) => {
                // 돌 뒤의 흰색 원 (배경) 생성 - 블러 효과가 있는 버전
                const haloGeometry = new THREE.CircleGeometry(data.size * 2, 64);
                
                // 그라디언트 텍스처 생성 (중앙에서 가장자리로 블러)
                const canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');
                
                // 방사형 그라디언트로 블러 효과 구현
                const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
                gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 256, 256);
                
                const haloTexture = new THREE.CanvasTexture(canvas);
                const haloMaterial = new THREE.MeshBasicMaterial({ 
                    map: haloTexture,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });
                
                const halo = new THREE.Mesh(haloGeometry, haloMaterial);
                halo.position.set(data.position.x, data.position.y, data.position.z - 0.5);
                halo.lookAt(camera.position);
                scene.add(halo);

                // GLB 모델 로드
                gltfLoader.load(
                    data.modelPath,
                    // 성공 콜백
                    function(gltf) {
                        const model = gltf.scene;
                        
                        // 모델 크기 조정
                        const box = new THREE.Box3().setFromObject(model);
                        const size = box.getSize(new THREE.Vector3());
                        const maxSize = Math.max(size.x, size.y, size.z);
                        const scale = data.size / maxSize;
                        model.scale.setScalar(scale);
                        
                        // 위치 설정
                        model.position.set(data.position.x, data.position.y, data.position.z);
                        
                        // 랜덤 회전
                        model.rotation.x = Math.random() * Math.PI;
                        model.rotation.y = Math.random() * Math.PI;
                        
                        // 데이터 저장
                        model.userData = data;
                        model.userData.index = index;
                        model.userData.halo = halo;
                        model.userData.originalRotation = {
                            x: model.rotation.x,
                            y: model.rotation.y,
                            z: model.rotation.z
                        };
                        
                        // 모델의 모든 메쉬에 원본 머티리얼 유지
                        model.traverse((child) => {
                            if (child.isMesh) {
                                // 원본 머티리얼과 텍스처를 그대로 유지
                                // 색상 오버라이드 하지 않음
                                if (child.material) {
                                    // 그림자나 조명 효과를 위해 필요한 경우만 설정
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        });
                        
                        scene.add(model);
                        stones.push(model);
                        
                        loadedCount++;
                        console.log(`모델 로드 완료: ${data.name} (${loadedCount}/${totalCount})`);
                        
                        // 모든 모델 로드 완료
                        if (loadedCount === totalCount) {
                            console.log('모든 3D 모델 로드 완료!');
                        }
                    },
                    // 진행 콜백
                    function(progress) {
                        console.log(`${data.name} 로딩 진행률:`, (progress.loaded / progress.total * 100) + '%');
                    },
                    // 에러 콜백 - GLB 로드 실패시 기본 형태로 대체
                    function(error) {
                        console.warn(`GLB 로드 실패 (${data.name}), 기본 형태로 대체:`, error);
                        
                        // 기본 기하학적 형태로 대체
                        let geometry;
                        const rand = Math.random();
                        if (rand < 0.3) {
                            geometry = new THREE.DodecahedronGeometry(data.size);
                        } else if (rand < 0.6) {
                            geometry = new THREE.IcosahedronGeometry(data.size);
                        } else {
                            geometry = new THREE.OctahedronGeometry(data.size);
                        }

                        const material = new THREE.MeshLambertMaterial({ 
                            color: data.color,
                            transparent: true,
                            opacity: 0.9
                        });

                        const fallbackStone = new THREE.Mesh(geometry, material);
                        fallbackStone.position.set(data.position.x, data.position.y, data.position.z);
                        fallbackStone.rotation.x = Math.random() * Math.PI;
                        fallbackStone.rotation.y = Math.random() * Math.PI;
                        
                        fallbackStone.userData = data;
                        fallbackStone.userData.index = index;
                        fallbackStone.userData.halo = halo;
                        fallbackStone.userData.originalRotation = {
                            x: fallbackStone.rotation.x,
                            y: fallbackStone.rotation.y,
                            z: fallbackStone.rotation.z
                        };
                        
                        scene.add(fallbackStone);
                        stones.push(fallbackStone);
                        
                        loadedCount++;
                    }
                );
            });
        }

        function addEventListeners() {
            const container = document.getElementById('container');
            const tooltip = document.getElementById('tooltip');

            // 마우스 이벤트
            container.addEventListener('mousedown', onMouseDown);
            container.addEventListener('mousemove', onMouseMove);
            container.addEventListener('mouseup', onMouseUp);
            container.addEventListener('wheel', onMouseWheel);

            // 툴팁 이벤트 - 툴팁에 마우스를 올렸을 때 사라지지 않도록
            tooltip.addEventListener('mouseenter', () => {
                isTooltipHovered = true;
                clearTimeout(tooltipTimeout);
            });

            tooltip.addEventListener('mouseleave', () => {
                isTooltipHovered = false;
                // 툴팁에서 마우스가 벗어나면 1초 후에 숨기기
                tooltipTimeout = setTimeout(() => {
                    if (!isTooltipHovered) {
                        hideTooltip();
                        currentStone = null;
                    }
                }, 1000);
            });

            // 전체 문서에서 마우스 이동 감지
            document.addEventListener('mousemove', (event) => {
                if (!isDragging && !isTooltipHovered) {
                    const containerRect = container.getBoundingClientRect();
                    if (event.clientX >= containerRect.left && 
                        event.clientX <= containerRect.right && 
                        event.clientY >= containerRect.top && 
                        event.clientY <= containerRect.bottom) {
                        // 컨테이너 내부에서는 기존 로직 사용
                        return;
                    } else {
                        // 컨테이너 외부로 마우스가 나가면 툴팁 숨기기
                        if (currentStone && !isTooltipHovered) {
                            tooltipTimeout = setTimeout(() => {
                                if (!isTooltipHovered) {
                                    hideTooltip();
                                    currentStone = null;
                                }
                            }, 500);
                        }
                    }
                }
            });

            // 터치 이벤트 (모바일 지원)
            container.addEventListener('touchstart', onTouchStart);
            container.addEventListener('touchmove', onTouchMove);
            container.addEventListener('touchend', onTouchEnd);

            // 윈도우 리사이즈
            window.addEventListener('resize', onWindowResize);
        }

        function onMouseDown(event) {
            isDragging = true;
            document.body.classList.add('dragging');
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            if (isDragging) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                // 카메라 회전
                camera.rotation.y += deltaMove.x * 0.005;
                camera.rotation.x += deltaMove.y * 0.005;
                
                // 수직 회전 제한
                camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));

                previousMousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            } else {
                // 호버 효과
                checkIntersection();
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.body.classList.remove('dragging');
        }

        function onMouseWheel(event) {
            // 줌 기능은 제한 (카메라가 중심에 고정되어야 함)
            event.preventDefault();
        }

        function onTouchStart(event) {
            if (event.touches.length === 1) {
                previousMousePosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
                isDragging = true;
            }
        }

        function onTouchMove(event) {
            if (event.touches.length === 1 && isDragging) {
                const deltaMove = {
                    x: event.touches[0].clientX - previousMousePosition.x,
                    y: event.touches[0].clientY - previousMousePosition.y
                };

                camera.rotation.y += deltaMove.x * 0.005;
                camera.rotation.x += deltaMove.y * 0.005;
                camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));

                previousMousePosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }
        }

        function onTouchEnd() {
            isDragging = false;
        }

        function checkIntersection() {
            raycaster.setFromCamera(mouse, camera);
            
            // GLB 모델의 경우 자식 메쉬들도 포함해서 체크
            const intersectableObjects = [];
            stones.forEach(stone => {
                if (stone.children && stone.children.length > 0) {
                    // GLB 모델인 경우 모든 자식 메쉬 추가
                    stone.traverse((child) => {
                        if (child.isMesh) {
                            child.userData = stone.userData; // 자식에게 부모 userData 복사
                            intersectableObjects.push(child);
                        }
                    });
                } else {
                    // 기본 기하학적 형태인 경우
                    intersectableObjects.push(stone);
                }
            });
            
            const intersects = raycaster.intersectObjects(intersectableObjects);

            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object;
                let intersectedStone;
                
                // userData가 있는 객체 찾기
                if (intersectedObject.userData && intersectedObject.userData.name) {
                    intersectedStone = intersectedObject;
                } else if (intersectedObject.parent && intersectedObject.parent.userData && intersectedObject.parent.userData.name) {
                    intersectedStone = intersectedObject.parent;
                } else {
                    // stones 배열에서 해당하는 모델 찾기
                    intersectedStone = stones.find(stone => {
                        if (stone === intersectedObject) return true;
                        let found = false;
                        stone.traverse((child) => {
                            if (child === intersectedObject) found = true;
                        });
                        return found;
                    });
                }
                
                if (intersectedStone && currentStone !== intersectedStone) {
                    clearTimeout(tooltipTimeout);
                    showTooltip(intersectedStone);
                    currentStone = intersectedStone;
                }
            } else {
                // 돌에서 벗어났지만 툴팁이 호버 상태가 아닐 때만 숨기기
                if (currentStone && !isTooltipHovered) {
                    tooltipTimeout = setTimeout(() => {
                        if (!isTooltipHovered) {
                            hideTooltip();
                            currentStone = null;
                        }
                    }, 800);
                }
            }
        }

        function showTooltip(stone) {
            const tooltip = document.getElementById('tooltip');
            const data = stone.userData;
            
            // 디버깅용 콘솔 로그
            console.log('Tooltip data:', data);

            // 데이터가 있는지 확인
            if (!data || !data.name) {
                console.warn('툴팁 데이터가 없습니다:', stone);
                return;
            }

            document.getElementById('tooltip-title').textContent = data.name || 'Unknown';
            document.getElementById('tooltip-description').textContent = data.description || 'No description';
            document.getElementById('tooltip-price').textContent = data.price || 'Price not available';

            // 마우스 위치에서 약간 오프셋을 주어 툴팁 표시
            tooltip.style.left = (mouse.x + 1) * window.innerWidth / 2 + 20 + 'px';
            tooltip.style.top = (-mouse.y + 1) * window.innerHeight / 2 + 20 + 'px';
            
            // 화면 경계 체크
            const tooltipRect = tooltip.getBoundingClientRect();
            if (tooltipRect.right > window.innerWidth) {
                tooltip.style.left = (mouse.x + 1) * window.innerWidth / 2 - tooltipRect.width - 20 + 'px';
            }
            if (tooltipRect.bottom > window.innerHeight) {
                tooltip.style.top = (-mouse.y + 1) * window.innerHeight / 2 - tooltipRect.height - 20 + 'px';
            }
            
            tooltip.classList.add('show');
        }

        function hideTooltip() {
            const tooltip = document.getElementById('tooltip');
            tooltip.classList.remove('show');
            clearTimeout(tooltipTimeout);
            isTooltipHovered = false;
        }

        function viewDetails() {
            if (currentStone) {
                showDetailModal(currentStone.userData);
                hideTooltip();
            }
        }

        function showDetailModal(stoneData) {
            const modal = document.getElementById('detailModal');
            
            // 데이터 업데이트
            document.getElementById('detailTitle').textContent = stoneData.name;
            document.getElementById('detailPrice').textContent = stoneData.price;
            document.getElementById('detailDescriptionKo').textContent = stoneData.descriptionKo || stoneData.description;
            document.getElementById('detailDescriptionEn').textContent = stoneData.descriptionEn || "A rare mineral from the depths of space.";
            
            console.log('모달 열기 - 데이터:', stoneData);
            console.log('모델 경로:', stoneData.modelPath);
            
            // 모달 표시 먼저
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // 약간의 지연 후 3D 뷰어 초기화 (DOM이 완전히 렌더링된 후)
            setTimeout(() => {
                // GLB 모델이 있으면 3D 뷰어로, 없으면 이미지로
                if (stoneData.modelPath) {
                    console.log('3D 뷰어 초기화 시작');
                    init3DViewer();
                    load3DModel(stoneData.modelPath);
                    document.getElementById('detail3DViewer').style.display = 'block';
                    document.getElementById('detailMineralImage').style.display = 'none';
                } else {
                    console.log('이미지 모드로 전환');
                    // 이미지 설정
                    const mineralImage = document.getElementById('detailMineralImage');
                    mineralImage.style.backgroundImage = `url(${stoneData.image})`;
                    document.getElementById('detail3DViewer').style.display = 'none';
                    document.getElementById('detailMineralImage').style.display = 'block';
                }
            }, 100);
        }

        function init3DViewer() {
            const container = document.getElementById('detail3DViewer');
            console.log('3D 뷰어 컨테이너:', container);
            console.log('컨테이너 크기:', container.clientWidth, 'x', container.clientHeight);
            
            // 기존 뷰어 정리
            if (detailRenderer) {
                if (container.contains(detailRenderer.domElement)) {
                    container.removeChild(detailRenderer.domElement);
                }
                detailRenderer.dispose();
            }
            
            // 컨테이너 크기 확인
            if (container.clientWidth === 0 || container.clientHeight === 0) {
                console.warn('컨테이너 크기가 0입니다. 잠시 후 재시도...');
                setTimeout(() => init3DViewer(), 200);
                return;
            }
            
            // 새로운 씬 생성
            detailScene = new THREE.Scene();
            detailScene.background = null; // 투명 배경
            
            // 카메라 생성
            const aspect = container.clientWidth / container.clientHeight;
            detailCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
            detailCamera.position.set(0, 0, 5);
            
            // 렌더러 생성
            detailRenderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true 
            });
            detailRenderer.setSize(container.clientWidth, container.clientHeight);
            detailRenderer.setClearColor(0x000000, 0); // 투명 배경
            detailRenderer.domElement.style.width = '100%';
            detailRenderer.domElement.style.height = '100%';
            
            container.appendChild(detailRenderer.domElement);
            console.log('렌더러 추가됨');
            
            // 조명 추가
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            detailScene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
            directionalLight.position.set(2, 2, 2);
            detailScene.add(directionalLight);
            
            // 포인트 라이트 추가 (더 밝게)
            const pointLight = new THREE.PointLight(0xffffff, 0.5);
            pointLight.position.set(-2, 2, 2);
            detailScene.add(pointLight);
            
            // 마우스 컨트롤 이벤트
            const canvas = detailRenderer.domElement;
            
            canvas.addEventListener('mousedown', (e) => {
                detailControls.isDragging = true;
                detailControls.previousMouse = { x: e.clientX, y: e.clientY };
                canvas.style.cursor = 'grabbing';
            });
            
            canvas.addEventListener('mousemove', (e) => {
                if (!detailControls.isDragging || !detailModel) return;
                
                const deltaX = e.clientX - detailControls.previousMouse.x;
                const deltaY = e.clientY - detailControls.previousMouse.y;
                
                detailModel.rotation.y += deltaX * 0.01;
                detailModel.rotation.x += deltaY * 0.01;
                
                detailControls.previousMouse = { x: e.clientX, y: e.clientY };
            });
            
            canvas.addEventListener('mouseup', () => {
                detailControls.isDragging = false;
                canvas.style.cursor = 'grab';
            });
            
            canvas.addEventListener('mouseleave', () => {
                detailControls.isDragging = false;
                canvas.style.cursor = 'grab';
            });
            
            // 휠 줌
            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomSpeed = 0.1;
                detailCamera.position.z += e.deltaY * zoomSpeed * 0.01;
                detailCamera.position.z = Math.max(2, Math.min(10, detailCamera.position.z));
            });
            
            canvas.style.cursor = 'grab';
            
            // 애니메이션 루프 시작
            animate3DViewer();
            
            console.log('3D 뷰어 초기화 완료');
        }

        function load3DModel(modelPath) {
            console.log('3D 모델 로드 시작:', modelPath);
            
            gltfLoader.load(
                modelPath,
                (gltf) => {
                    console.log('GLB 로드 성공:', gltf);
                    
                    // 기존 모델 제거
                    if (detailModel) {
                        detailScene.remove(detailModel);
                    }
                    
                    detailModel = gltf.scene;
                    
                    // 모델 크기 조정
                    const box = new THREE.Box3().setFromObject(detailModel);
                    const size = box.getSize(new THREE.Vector3());
                    const maxSize = Math.max(size.x, size.y, size.z);
                    const scale = 2 / maxSize; // 적절한 크기로 조정
                    detailModel.scale.setScalar(scale);
                    
                    console.log('모델 원본 크기:', size);
                    console.log('스케일 적용:', scale);
                    
                    // 모델을 중앙에 배치
                    const center = box.getCenter(new THREE.Vector3());
                    detailModel.position.sub(center.multiplyScalar(scale));
                    
                    // 모델의 모든 메쉬가 보이도록 설정
                    detailModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            console.log('메쉬 발견:', child.name, child.material);
                        }
                    });
                    
                    detailScene.add(detailModel);
                    
                    console.log('상세 모달 3D 모델 로드 완료');
                    console.log('씬 객체 수:', detailScene.children.length);
                },
                (progress) => {
                    console.log('로딩 진행률:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('상세 모달 3D 모델 로드 실패:', error);
                    
                    // 실패 시 대체 큐브 표시
                    const geometry = new THREE.BoxGeometry(2, 2, 2);
                    const material = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
                    detailModel = new THREE.Mesh(geometry, material);
                    detailScene.add(detailModel);
                    
                    console.log('대체 큐브 생성됨');
                }
            );
        }

        function animate3DViewer() {
            if (!detailRenderer || !detailScene || !detailCamera) return;
            
            requestAnimationFrame(animate3DViewer);
            
            // 자동 회전 (마우스 드래그 중이 아닐 때만)
            if (detailModel && !detailControls.isDragging) {
                detailModel.rotation.y += 0.005;
            }
            
            detailRenderer.render(detailScene, detailCamera);
        }

        function closeDetailModal() {
            const modal = document.getElementById('detailModal');
            modal.classList.remove('show');
            document.body.style.overflow = 'hidden'; // 원래 오버플로우 유지
            
            // 3D 뷰어 정리
            if (detailRenderer) {
                const container = document.getElementById('detail3DViewer');
                if (container.contains(detailRenderer.domElement)) {
                    container.removeChild(detailRenderer.domElement);
                }
                detailRenderer.dispose();
                detailRenderer = null;
            }
            
            if (detailScene) {
                // 씬의 모든 객체 정리
                while(detailScene.children.length > 0) {
                    detailScene.remove(detailScene.children[0]);
                }
                detailScene = null;
            }
            
            detailModel = null;
            detailCamera = null;
        }

        function addToCart() {
            if (currentStone) {
                alert(`${currentStone.userData.name}이(가) 장바구니에 추가되었습니다!`);
                // 실제 장바구니 로직 구현
            }
        }

        function shareItem() {
            if (currentStone) {
                // 웹 공유 API 또는 클립보드 복사
                if (navigator.share) {
                    navigator.share({
                        title: currentStone.userData.name,
                        text: currentStone.userData.description,
                        url: window.location.href
                    });
                } else {
                    // 클립보드에 링크 복사
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        alert('링크가 클립보드에 복사되었습니다!');
                    });
                }
            }
        }

        function toggleFavorite() {
            if (currentStone) {
                const icon = event.target;
                if (icon.textContent === '♡') {
                    icon.textContent = '♥';
                    icon.style.color = '#ff4444';
                    alert(`${currentStone.userData.name}이(가) 찜 목록에 추가되었습니다!`);
                } else {
                    icon.textContent = '♡';
                    icon.style.color = '#000';
                    alert(`${currentStone.userData.name}이(가) 찜 목록에서 제거되었습니다!`);
                }
            }
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            // 돌들 자동 회전
            stones.forEach((stone, index) => {
                // 회전 애니메이션
                stone.rotation.x += 0.005;
                stone.rotation.y += 0.003;
                
                // 미세한 떠다니는 효과
                const originalY = stone.userData.position ? stone.userData.position.y : 0;
                stone.position.y = originalY + Math.sin(Date.now() * 0.001 + index) * 0.5;
                
                // halo도 같은 Y 위치로 동기화
                if (stone.userData.halo) {
                    stone.userData.halo.position.y = stone.position.y;
                    // halo가 항상 카메라를 향하도록
                    stone.userData.halo.lookAt(camera.position);
                }
            });

            renderer.render(scene, camera);
        }
    
        // 초기화 실행
        init();