<script>
// import imgs from "@/assets/imgs.json";
// global variables
// var imgs_candidates = imgs;
var imgs_candidates = [];
var imgs_test = [];

//global functions
function status_changing(img_status_changed) {
  imgs_candidates[img_status_changed.id].img_work_status =
    img_status_changed.img_work_status;
}

export default {
  imgs_candidates,
  imgs_test,
  status_changing
};
</script>