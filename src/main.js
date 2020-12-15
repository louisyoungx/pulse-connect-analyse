import { createApp } from 'vue'
import App from './App.vue';
import router from './router'
import store from './store'
import './registerServiceWorker'

const xiao = createApp(App);
xiao.use(store).use(router).mount('#app')



/* Element-Plus Component */
import 'element-plus/lib/theme-chalk/index.css';
import {
    ElButton,
    ElRow,
    ElCarousel,
    ElCarouselItem,
    ElImage,
    ElPageHeader,
    ElDatePicker
} from 'element-plus';
xiao.use(ElButton).use(ElRow).use(ElCarousel).use(ElCarouselItem).use(ElImage).use(ElPageHeader).use(ElDatePicker)

/* Vant Component */
import {
    ActionSheet,
    AddressEdit,
    AddressList,
    Area,
    Badge,
    Button,
    Card,
    Cell,
    CellGroup,
    Checkbox,
    CheckboxGroup,
    Circle,
    Col,
    Collapse,
    CollapseItem,
    ContactCard,
    ContactEdit,
    ContactList,
    Coupon,
    CouponCell,
    CouponList,
    DatetimePicker,
    Dialog,
    Field,
    Icon,
    ImagePreview,
    Image as VanImage,
    Lazyload,
    List,
    Loading,
    Locale,
    NavBar,
    NoticeBar,
    Notify,
    NumberKeyboard,
    Overlay,
    Pagination,
    PasswordInput,
    Picker,
    Popup,
    Progress,
    PullRefresh,
    Radio,
    RadioGroup,
    Rate,
    Row,
    Search,
    Slider,
    Step,
    Stepper,
    Steps,
    SubmitBar,
    Swipe,
    SwipeCell,
    SwipeItem,
    Switch,
    Tab,
    Tabbar,
    TabbarItem,
    Tabs,
    Tag,
    Toast,
    TreeSelect,
    Uploader
} from "vant";
xiao.use(ActionSheet)
    .use(AddressEdit)
    .use(AddressList)
    .use(Area)
    .use(Badge)
    .use(Button)
    .use(Card)
    .use(Cell)
    .use(CellGroup)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Circle)
    .use(Col)
    .use(Collapse)
    .use(CollapseItem)
    .use(ContactCard)
    .use(ContactEdit)
    .use(ContactList)
    .use(Coupon)
    .use(CouponCell)
    .use(CouponList)
    .use(DatetimePicker)
    .use(Dialog)
    .use(Field)
    .use(Icon)
    .use(ImagePreview)
    .use(VanImage)
    .use(Lazyload)
    .use(List)
    .use(Loading)
    .use(Locale)
    .use(NavBar)
    .use(NoticeBar)
    .use(Notify)
    .use(NumberKeyboard)
    .use(Overlay)
    .use(Pagination)
    .use(PasswordInput)
    .use(Picker)
    .use(Popup)
    .use(Progress)
    .use(PullRefresh)
    .use(Radio)
    .use(RadioGroup)
    .use(Rate)
    .use(Row)
    .use(Search)
    .use(Slider)
    .use(Step)
    .use(Stepper)
    .use(Steps)
    .use(SubmitBar)
    .use(Swipe)
    .use(SwipeCell)
    .use(SwipeItem)
    .use(Switch)
    .use(Tab)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Tabs)
    .use(Tag)
    .use(Toast)
    .use(TreeSelect)
    .use(Uploader)
