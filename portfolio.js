
gsap.registerPlugin(ScrollTrigger);

const background = document.querySelector('.background');
const slider = document.querySelector('.slider');

const sections = gsap.utils.toArray('.slider section');
const back_ani = gsap.utils.toArray('.background img');

let timeline = gsap.timeline({
    defaults: {
        ease: 'none'
    },
    ScrollTrigger: {
        trigger: 'slider',
        pin: true,
        scrub: 2,
        end: () => "+=" + slider.offsetWidth
    }

})

const lenis = new Lenis()

lenis.on('scroll', (e) => {
    console.log(e)
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)