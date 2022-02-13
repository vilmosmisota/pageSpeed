export default function setWrapper(img) {
  const wrapper = document.createElement("figure");
  img.parentElement.insertBefore(wrapper, img);
  wrapper.appendChild(img);
  wrapper.style.border = "1px solid red";
}
