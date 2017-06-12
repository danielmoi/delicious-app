import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(event) {
  event.preventDefault();

  axios.post(this.action)
  .then(res => {
    // this.heart works because our heart has a NAME attribute of "heart"!!
    const isHearted = this.heart.classList.toggle('heart__button--hearted');

    // urggg....
    $('.heart-count').textContent = res.data.hearts.length;

    // add animation if we are HEARTING!
    if (isHearted) {
      this.heart.classList.add('heart__button--float');
      setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
    }

  }).catch(e => console.error(e));
}

export default ajaxHeart;
