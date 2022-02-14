import { render } from 'utils/jsx'
import { writable } from 'utils/state'
import Slider from 'components/Slider'

const value = writable(0)

render(
  <Slider
    store-value={value}
    min='0'
    max='100'
    step='1'
    path='M15.422,18.129l-5.264-2.768l-5.265,2.768l1.006-5.863L1.64,8.114l5.887-0.855 l2.632-5.334l2.633,5.334l5.885,0.855l-4.258,4.152L15.422,18.129z'
    // path='M 180,80 L100,180 20,80 A 40,40 0,0,1 100,80 A 40,40 0,0,1 180,80'
  />,
  document.querySelector('main')
)

value.subscribe(v => {
  console.log(v)
})
