<template>
  <div>
    <HeroSection />
    <FeaturedProducts />
    <SpecialCampaigns />
    <FeaturedBlogs />
    <AboutPreview />
  </div>
</template>

<script>
import HeroSection from '@/components/home/HeroSection.vue'
import FeaturedProducts from '@/components/home/FeaturedProducts.vue'
import SpecialCampaigns from '@/components/home/SpecialCampaigns.vue'
import FeaturedBlogs from '@/components/home/FeaturedBlogs.vue'
import AboutPreview from '@/components/home/AboutPreview.vue'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    FeaturedProducts,
    SpecialCampaigns,
    FeaturedBlogs,
    AboutPreview
  }
}
</script> 