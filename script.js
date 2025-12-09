// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const timeDescEl = document.getElementById('timeDesc');
    const videoOverlay = document.querySelector('.video-overlay');
    const tags = document.querySelectorAll('.tag');
    const detailTitle = document.getElementById('detailTitle');
    const detailTime = document.getElementById('detailTime');
    const detailContent = document.getElementById('detailContent');
    const quizContainer = document.getElementById('quizContainer');
    const submitQuizBtn = document.getElementById('submitQuiz');
    const resetQuizBtn = document.getElementById('resetQuiz');
    const quizResult = document.getElementById('quizResult');
    const poemKeyword = document.getElementById('poemKeyword');
    const generatePoemBtn = document.getElementById('generatePoem');
    const poemResult = document.getElementById('poemResult');
    const poemHistory = document.getElementById('poemHistory');

    // YouTube 播放器实例
    let player;
    let timeUpdateInterval;
    
    // 视频ID
    const YOUTUBE_VIDEO_ID = 'wIzL76GFPHs';

    // 视频时间点描述
    const timeDescriptions = [
        { start: 0, end: 25, title: "开篇：云冈石窟的恢弘气势", desc: "武州山南麓，石窟群依山蜿蜒" },
        { start: 25, end: 70, title: "历史篇：昙曜五窟与皇家工程", desc: "北魏皇家开凿，昙曜五窟的诞生" },
        { start: 70, end: 130, title: "艺术篇：音乐窟与飞天演变", desc: "第12窟音乐窟，飞天形象的演变" },
        { start: 130, end: 160, title: "传承篇：科技保护与文化传播", desc: "AR技术、AI复原与数字化保护" },
        { start: 160, end: 180, title: "结尾：千年文明的对话", desc: "从北魏工匠到现代科技的传承" }
    ];

    // 文字标签数据
    const tagData = {
        wutai: {
            title: "武州山南麓",
            time: "0:00",
            content: "云冈石窟位于山西省大同市西郊约16公里的武州山南麓，石窟依山开凿，东西绵延约1公里。现存主要洞窟45个，附属洞窟209个，雕刻面积达18000余平方米，造像最高为17米，最小为2厘米，佛龛约1100多个，大小造像59000余尊。"
        },
        tanyao: {
            title: "昙曜五窟（第16-20窟）",
            time: "0:30",
            content: "由北魏高僧昙曜主持开凿，是云冈石窟最早开凿的五个洞窟。据《魏书》记载，这五窟分别为北魏的道武、明元、太武、景穆、文成五位皇帝祈福而建，开创了'皇帝即如来'的造像先例。造像风格浑厚雄伟，带有浓郁的西域风格。"
        },
        music: {
            title: "第12窟 - 音乐窟",
            time: "1:15",
            content: "又称'音乐窟'，是云冈石窟中期洞窟的代表。窟内雕刻了数十尊手持各种乐器的'天宫乐伎'，乐器种类包括琵琶、筚篥、横笛、排箫、鼓等，共计14种47件，是研究中国古代音乐史的珍贵实物资料。"
        },
        flying: {
            title: "飞天形象演变",
            time: "1:45",
            content: "云冈石窟的飞天形象记录了佛教艺术中国化的历程：早期（昙曜五窟）飞天体态健硕，带有印度、中亚风格；中期（第5-13窟）变得轻盈飘逸；晚期（西部窟群）则演变为'秀骨清像'，身材修长，衣带飘逸，呈现南朝名士风范。"
        },
        tech: {
            title: "科技保护与数字化",
            time: "2:15",
            content: "现代科技为云冈石窟保护提供了新手段：三维激光扫描建立毫米级数字档案；AI技术监测风化状况；AR/VR技术让游客沉浸式体验；基于石窟艺术风格训练的AI模型可生成'云冈风'数字艺术作品，实现传统文化的创造性转化。"
        }
    };

    // 问答题库
    const quizQuestions = [
        {
            id: 1,
            question: "云冈石窟开凿于哪个朝代？",
            options: [
                { id: 'a', text: "A. 北魏" },
                { id: 'b', text: "B. 唐代" },
                { id: 'c', text: "C. 宋代" },
                { id: 'd', text: "D. 明代" }
            ],
            correct: 'a',
            explanation: "云冈石窟始凿于北魏和平元年（公元460年），由高僧昙曜主持开凿，是北魏王朝的皇家工程。"
        },
        {
            id: 2,
            question: "云冈石窟最早的五个洞窟被称为？",
            options: [
                { id: 'a', text: "A. 皇家五窟" },
                { id: 'b', text: "B. 昙曜五窟" },
                { id: 'c', text: "C. 北魏五窟" },
                { id: 'd', text: "D. 文成五窟" }
            ],
            correct: 'b',
            explanation: "由高僧昙曜主持开凿的第16-20窟被称为'昙曜五窟'，据记载是为北魏五位皇帝祈福而建。"
        },
        {
            id: 3,
            question: "被称为'音乐窟'的是第几窟？",
            options: [
                { id: 'a', text: "A. 第5窟" },
                { id: 'b', text: "B. 第6窟" },
                { id: 'c', text: "C. 第9窟" },
                { id: 'd', text: "D. 第12窟" }
            ],
            correct: 'd',
            explanation: "第12窟内雕刻了大量手持乐器的天宫乐伎，乐器种类丰富，因此被称为'音乐窟'，是研究古代音乐史的重要资料。"
        },
        {
            id: 4,
            question: "云冈石窟的飞天形象经历了怎样的演变？",
            options: [
                { id: 'a', text: "A. 从清瘦到丰腴" },
                { id: 'b', text: "B. 从丰腴到清瘦" },
                { id: 'c', text: "C. 一直保持不变" },
                { id: 'd', text: "D. 从彩色到单色" }
            ],
            correct: 'b',
            explanation: "云冈飞天经历了'飞天减肥史'：早期丰满健硕（西域风格）→中期轻盈飘逸→晚期秀骨清像（南朝风格），体现了佛教艺术中国化的过程。"
        }
    ];

    // 诗歌库（基于关键词）
    const poemLibrary = {
        "石窟": [
            "石壁千年刻佛光，云冈深处藏经藏。\n北魏匠心传万代，风霜难掩旧时妆。",
            "斧凿声声震武州，佛陀微笑越千秋。\n昙曜宏愿今犹在，华夏文明一脉流。"
        ],
        "佛像": [
            "佛陀静坐阅沧桑，眉目低垂渡十方。\n石质虽坚心更坚，千年风雨守云冈。",
            "大佛巍巍立山前，慈悲目光照大千。\n任它岁月如流水，法相庄严永不变。"
        ],
        "飞天": [
            "衣带当风舞碧空，云冈飞天气如虹。\n从胡到汉形渐变，艺术长河一脉通。",
            "飞天本是西来客，落入云冈换新裳。\n魏晋风流凝石上，清姿秀骨韵悠长。"
        ],
        "北魏": [
            "平城曾是帝都场，拓跋雄心刻石墙。\n佛教东来融汉土，云冈一窟证辉煌。",
            "北魏王朝崇佛事，云冈石窟立丰碑。\n中西合璧开新境，艺术高峰后人追。"
        ],
        "音乐": [
            "十二窟中音乐扬，天宫乐伎奏华章。\n琵琶筚篥传千古，石上犹闻北魏腔。",
            "凝固音符石上藏，云冈乐伎技非常。\n千年沉寂今重响，数字科技复其详。"
        ],
        "科技": [
            "千年石窟遇新机，数字科技解玄微。\n扫描建模存真貌，AI复原先贤晖。",
            "传统现代两相宜，云冈保护有新蹊。\n虚拟现实展全貌，文化遗产焕生机。"
        ]
    };

    // 默认诗歌（当关键词不匹配时）
    const defaultPoems = [
        "武州山下洞窟连，北魏遗风石上镌。\n千年文化谁传续？数字科技谱新篇。",
        "云冈石窟世无双，石佛万千呈瑞祥。\n古今对话凭科技，文明薪火永传扬。"
    ];

    // 在YouTube播放器初始化函数前添加加载状态
    function initYouTubePlayer() {
        // 检查YouTube API是否已加载
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            console.log('等待YouTube API加载...');
            // 延迟重试
            setTimeout(initYouTubePlayer, 500);
            return;
        }
        
        console.log('初始化YouTube播放器，视频ID:', YOUTUBE_VIDEO_ID);
        
        // 添加加载状态
        const videoContainer = document.querySelector('.video-container');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'video-loading';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在加载视频...';
        videoContainer.appendChild(loadingDiv);
        
        // 创建播放器实例
        player = new YT.Player('youtubePlayer', {
            height: '100%',
            width: '100%',
            videoId: YOUTUBE_VIDEO_ID,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'disablekb': 0,
                'enablejsapi': 1,
                'fs': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'iv_load_policy': 3 // 不显示视频注释
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    }

    // YouTube播放器准备就绪
    function onPlayerReady(event) {
        console.log('YouTube播放器已准备就绪');
        
        // 移除加载状态
        const loadingDiv = document.querySelector('.video-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
        
        // 设置总时长
        const duration = player.getDuration();
        if (duration && duration > 0) {
            totalTimeEl.textContent = formatTime(duration);
        } else {
            totalTimeEl.textContent = '3:00'; // 默认值
        }
        
        // 初始化视频标签
        initVideoTags();
        
        // 默认显示第一个标签的详情
        showTagDetail('wutai');
    }

    // YouTube播放器状态变化
    function onPlayerStateChange(event) {
        switch(event.data) {
            case YT.PlayerState.PLAYING:
                // 开始更新时间
                startTimeUpdate();
                break;
            case YT.PlayerState.PAUSED:
                // 停止更新时间
                stopTimeUpdate();
                break;
            case YT.PlayerState.ENDED:
                // 视频结束，停止更新时间
                stopTimeUpdate();
                // 滚动到问答区域
                document.querySelector('.quiz-section').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                break;
        }
    }

    // YouTube播放器错误处理
    function onPlayerError(event) {
        console.error('YouTube播放器错误代码:', event.data);
        
        // 移除加载状态
        const loadingDiv = document.querySelector('.video-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
        
        // 显示错误信息
        const videoContainer = document.querySelector('.video-container');
        let errorMessage = '';
        
        switch(event.data) {
            case 2:
                errorMessage = '视频ID无效或视频不存在';
                break;
            case 5:
                errorMessage = 'HTML5播放器错误，请尝试其他浏览器';
                break;
            case 100:
                errorMessage = '视频不存在或已被删除';
                break;
            case 101:
            case 150:
                errorMessage = '视频所有者禁止嵌入播放';
                break;
            default:
                errorMessage = '视频加载失败，错误代码: ' + event.data;
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3>视频加载失败</h3>
            <p>${errorMessage}</p>
            <p>您可以 <a href="https://youtu.be/${YOUTUBE_VIDEO_ID}" target="_blank">点击这里直接访问YouTube观看视频</a></p>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #ccc;">
                如果这是您的视频，请确保已设置为"公开"或"不公开（可嵌入）"
            </p>
        `;
        videoContainer.appendChild(errorDiv);
    }

    // 开始更新时间显示
    function startTimeUpdate() {
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
        }
        timeUpdateInterval = setInterval(updateTimeDisplay, 1000);
    }

    // 停止更新时间显示
    function stopTimeUpdate() {
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
            timeUpdateInterval = null;
        }
    }

    // 初始化视频标签
    function initVideoTags() {
        // 清空现有标签
        videoOverlay.innerHTML = '';
        
        // 添加视频时间标签
        const tagPositions = [
            { id: 'wutai', time: 10, left: '20%', top: '30%' },
            { id: 'tanyao', time: 40, left: '60%', top: '50%' },
            { id: 'music', time: 80, left: '40%', top: '40%' },
            { id: 'flying', time: 100, left: '70%', top: '30%' },
            { id: 'tech', time: 140, left: '30%', top: '60%' }
        ];
        
        tagPositions.forEach(pos => {
            const tagEl = document.createElement('div');
            tagEl.className = 'video-tag';
            tagEl.id = `tag-${pos.id}`;
            tagEl.style.left = pos.left;
            tagEl.style.top = pos.top;
            tagEl.style.display = 'none';
            tagEl.innerHTML = `<i class="fas fa-info-circle"></i> ${tagData[pos.id].title}`;
            tagEl.dataset.tagId = pos.id;
            tagEl.dataset.time = pos.time;
            
            tagEl.addEventListener('click', function() {
                const tagId = this.dataset.tagId;
                showTagDetail(tagId);
            });
            
            videoOverlay.appendChild(tagEl);
        });
    }

    // 显示标签详情
    function showTagDetail(tagId) {
        const data = tagData[tagId];
        if (!data) return;
        
        detailTitle.textContent = data.title;
        detailTime.textContent = data.time;
        detailContent.textContent = data.content;
        
        // 高亮对应的标签
        tags.forEach(tag => {
            tag.classList.remove('active');
            if (tag.dataset.tag === tagId) {
                tag.classList.add('active');
            }
        });
    }

    // 更新视频时间显示
    function updateTimeDisplay() {
        if (!player || !player.getCurrentTime) return;
        
        try {
            const current = player.getCurrentTime();
            const total = player.getDuration() || 180; // 默认3分钟
            
            currentTimeEl.textContent = formatTime(current);
            totalTimeEl.textContent = formatTime(total);
            
            // 更新当前时间段描述
            for (const desc of timeDescriptions) {
                if (current >= desc.start && current < desc.end) {
                    timeDescEl.textContent = desc.title;
                    break;
                }
            }
            
            // 显示/隐藏视频标签
            const videoTags = document.querySelectorAll('.video-tag');
            videoTags.forEach(tag => {
                const tagTime = parseInt(tag.dataset.time);
                if (Math.abs(current - tagTime) < 5) {
                    tag.style.display = 'flex';
                } else {
                    tag.style.display = 'none';
                }
            });
        } catch (error) {
            console.warn('获取播放器时间时出错:', error);
        }
    }

    // 格式化时间（秒 -> 分:秒）
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 初始化问答
    function initQuiz() {
        quizContainer.innerHTML = '';
        
        quizQuestions.forEach((q, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question';
            questionEl.dataset.questionId = q.id;
            
            let optionsHtml = '';
            q.options.forEach(opt => {
                optionsHtml += `
                    <div class="option" data-option="${opt.id}">
                        <div class="option-selector"></div>
                        <div class="option-text">${opt.text}</div>
                    </div>
                `;
            });
            
            questionEl.innerHTML = `
                <h3>${index + 1}. ${q.question}</h3>
                <div class="options">${optionsHtml}</div>
            `;
            
            quizContainer.appendChild(questionEl);
        });
        
        // 为选项添加点击事件
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const questionEl = this.closest('.question');
                const questionId = questionEl.dataset.questionId;
                const selectedOption = this.dataset.option;
                
                // 清除同一问题下的其他选择
                questionEl.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // 标记当前选择
                this.classList.add('selected');
                
                // 保存选择
                this.dataset.selected = 'true';
            });
        });
    }

    // 提交问答
    function submitQuiz() {
        let correctCount = 0;
        const results = [];
        
        document.querySelectorAll('.question').forEach(questionEl => {
            const questionId = parseInt(questionEl.dataset.questionId);
            const question = quizQuestions.find(q => q.id === questionId);
            const selectedOption = questionEl.querySelector('.option.selected');
            
            if (!selectedOption) {
                results.push({
                    question: question.question,
                    userAnswer: '未回答',
                    correctAnswer: question.options.find(opt => opt.id === question.correct).text,
                    explanation: question.explanation,
                    isCorrect: false
                });
                return;
            }
            
            const userAnswer = selectedOption.dataset.option;
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) correctCount++;
            
            results.push({
                question: question.question,
                userAnswer: selectedOption.querySelector('.option-text').textContent,
                correctAnswer: question.options.find(opt => opt.id === question.correct).text,
                explanation: question.explanation,
                isCorrect: isCorrect
            });
        });
        
        // 显示结果
        const score = Math.round((correctCount / quizQuestions.length) * 100);
        
        let resultsHtml = `
            <h3 class="result-title">答题完成！</h3>
            <div class="result-score">得分：${score}分（答对 ${correctCount}/${quizQuestions.length} 题）</div>
            <div class="result-details">
        `;
        
        results.forEach(result => {
            const correctClass = result.isCorrect ? 'correct' : 'incorrect';
            const icon = result.isCorrect ? '✓' : '✗';
            
            resultsHtml += `
                <div class="result-item ${correctClass}">
                    <div><strong>${result.question}</strong></div>
                    <div>你的答案：${result.userAnswer}</div>
                    <div>正确答案：${result.correctAnswer}</div>
                    <div>${result.explanation}</div>
                </div>
            `;
        });
        
        resultsHtml += '</div>';
        quizResult.innerHTML = resultsHtml;
        quizResult.style.display = 'block';
        
        // 滚动到结果
        quizResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 生成诗歌
    function generatePoem() {
        const keyword = poemKeyword.value.trim();
        let poemText = '';
        let author = '—— AI生成';
        
        if (!keyword) {
            // 随机选择一首默认诗歌
            const randomIndex = Math.floor(Math.random() * defaultPoems.length);
            poemText = defaultPoems[randomIndex];
        } else {
            // 查找匹配关键词的诗歌
            const matchedKey = Object.keys(poemLibrary).find(key => 
                keyword.includes(key) || key.includes(keyword)
            );
            
            if (matchedKey && poemLibrary[matchedKey]) {
                const poems = poemLibrary[matchedKey];
                const randomIndex = Math.floor(Math.random() * poems.length);
                poemText = poems[randomIndex];
            } else {
                // 随机选择一首默认诗歌
                const randomIndex = Math.floor(Math.random() * defaultPoems.length);
                poemText = defaultPoems[randomIndex];
            }
        }
        
        // 显示诗歌
        poemResult.innerHTML = `
            <div class="poem-text">${poemText.replace(/\n/g, '<br>')}</div>
            <div class="poem-author">${author}</div>
        `;
        
        // 添加到历史记录
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `关键词"${keyword || '随机'}"：${poemText.split('\n')[0].substring(0, 30)}...`;
        
        const historyList = poemHistory.querySelector('.history-list') || document.createElement('div');
        if (!poemHistory.querySelector('.history-list')) {
            historyList.className = 'history-list';
            poemHistory.innerHTML = '<div class="history-title">最近生成：</div>';
            poemHistory.appendChild(historyList);
        }
        
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // 限制历史记录数量
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
        
        // 清空输入框
        poemKeyword.value = '';
    }

    // 绑定事件
    playBtn.addEventListener('click', () => {
        if (player && player.playVideo) {
            player.playVideo();
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        if (player && player.pauseVideo) {
            player.pauseVideo();
        }
    });
    
    restartBtn.addEventListener('click', () => {
        if (player && player.seekTo) {
            player.seekTo(0);
            player.playVideo();
        }
    });
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagId = this.dataset.tag;
            showTagDetail(tagId);
        });
    });
    
    submitQuizBtn.addEventListener('click', submitQuiz);
    resetQuizBtn.addEventListener('click', () => {
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        quizResult.style.display = 'none';
    });
    
    generatePoemBtn.addEventListener('click', generatePoem);
    
    poemKeyword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePoem();
        }
    });
    
    // 初始化
    initQuiz();
    
    // 确保YouTube API已加载
    if (typeof YT !== 'undefined' && YT.loaded) {
        initYouTubePlayer();
    } else {
        // 监听YouTube API加载
        window.onYouTubeIframeAPIReady = function() {
            console.log('YouTube API已加载');
            initYouTubePlayer();
        };
        
        // 如果YouTube API未加载，设置超时检查
        setTimeout(() => {
            if (!player && typeof YT !== 'undefined' && YT.loaded) {
                initYouTubePlayer();
            }
        }, 2000);
    }
});