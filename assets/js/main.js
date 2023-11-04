var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
var progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatbtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const PLAYER_STORAGE_KEY = "F8_PLAYER"
const app = {
    currentIndex: 1,
    isPlaying: false,
    isRandom : false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || {}),
    songs : [
        {
            name: 'Faded',
            singer: "British-Norwegian",
            path: "./assets/video/Faded.mp3",
            image: "./assets/img/fadedimg.jpg"
        },
        {
            name: 'TheNight',
            singer: "Johanna Mo",
            path: "./assets/video/TheNight.mp3",
            image: "./assets/img/thenight.jpg"
        },
        {
            name: 'Unstopable',
            singer: " Australian ",
            path: "./assets/video/Unstoppable.mp3",
            image: "./assets/img/unstopable.jpg"
        },
        {
            name: 'We Dont Talk Anymore',
            singer: "British-Norwegian",
            path: "./assets/video/WeDontTalkAnymore.mp3",
            image: "./assets/img/wedonttalkanymore.jpg"
        },
    
    ],

    setConfig : function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
                <div  class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
        
    },

    handlEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth
  
        // Xử lý CD quay / dừng 
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'},

        ],{
            duration: 10000,
            easing: 'linear',
            fill: 'forwards',
            direction: 'normal',
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ cd
        document.onscroll = function(){
            var scrollTop = window.scrollY || document.documentElement.scrollTop
            var newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0 +'px'
            cd.style.opacity = newCdWidth/cdWidth
        }

        // Xử lý khi được click play

        playBtn.onclick = function(){
            if(_this.isPlaying){  
                audio.pause();
            }else{
                audio.play();
            }

            //Khi bài hát đươc play
            audio.onplay = function(){
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play();
            }
            

            // Khi song bị pause
            audio.onpause = function(){
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause();
            }

            // Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }

            // Xử lý khi tua bài hát
            progress.oninput = function(e){
                const seekTime = audio.duration * (e.target.value / 100);
                audio.currentTime = seekTime;
            }


            
            

            
        }
        // Khi next bai hat
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong();
            }

            if(_this.isPlaying){
                audio.play();
            }
            _this.render();
            _this.srollToActiveSong()
            
        }

        // Khi prev bai hat
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong();
            }

            if(_this.isPlaying){
                audio.play();
            }
            _this.render();
            _this.srollToActiveSong()
        }

        // Xử lý Random bai hat
        randomBtn.onclick = function(){
            _this.isRandom =!_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
            
        }

        // Xử lý phát lại 1 bài hát
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }
        // Tự động phát bài mới
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }

        // Click  vào playList 
        playList.onclick = function(e){
            
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || !e.target.closest('.options')){
                // Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.isPlaying = true;
                    _this.render();
                    audio.play();
             
                }

                // Xử lý khí click vaò option
                if(!e.target.closest('.option')){

                }
            }
        }

    },
    
    srollToActiveSong: function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }, 300)
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        //Object.assign(this, this.config)
    },
    loadCurrentSong: function(){
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
        
    },
    removeClassActive: function(){

    },

    getCurrentSong: function() {
        return this.songs[this.currentIndex]
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },
    start: function(){
        // Gán cấu hình từ config vaò ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        this.render();

        this.loadCurrentSong();

        this.handlEvents();

        // Hiện thị trạng thái ban đầu của btn random và repeat
        repeatBtn.classList.toggle("active", this.isRepeat);
        randomBtn.classList.toggle("active", this.isRandom);
    }
}
app.start()



