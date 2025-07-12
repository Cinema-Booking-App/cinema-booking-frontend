"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
  Shield,
  Clock,
  HelpCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/client/theme-toggle'
import Logo from './header/logo'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FooterLink {
  name: string
  href: string
}

interface SocialLink {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

// ============================================================================
// COMPONENT: Company Info Section
// ============================================================================

const CompanyInfo = () => {
  const socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  ]

  return (
    <div className="lg:col-span-1">
      {/* Logo and Company Name */}
      <div className="mb-4">
        <Logo />
      </div>
      
      {/* Company Description */}
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        Hệ thống rạp chiếu phim hàng đầu Việt Nam, mang đến trải nghiệm xem phim tuyệt vời nhất cho khách hàng.
      </p>
      
      {/* Social Media Links */}
      <div className="flex items-center gap-2 sm:gap-3">
        {socialLinks.map((social) => (
          <Button
            key={social.name}
            variant="ghost"
            size="icon"
            asChild
            className="w-8 h-8 sm:w-9 sm:h-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <a 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={social.name}
            >
              <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Footer Links Section
// ============================================================================

const FooterLinks = ({ title, links }: { title: string; links: FooterLink[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-base sm:text-lg mb-4">{title}</h3>
      <ul className="space-y-2 sm:space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors duration-200 block py-1"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================================
// COMPONENT: Contact & Support Section
// ============================================================================

const ContactSupport = () => {
  const contactInfo: ContactInfo[] = [
    { icon: Phone, label: 'Hotline', value: '1900 1234' },
    { icon: Mail, label: 'Email', value: 'support@cinema.com' },
    { icon: MapPin, label: 'Địa chỉ', value: '123 Đường ABC, Quận 1, TP.HCM' },
    { icon: Clock, label: 'Giờ làm việc', value: '8:00 - 22:00 (T2-CN)' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-base sm:text-lg mb-4">Liên hệ & Hỗ trợ</h3>
      <div className="space-y-3 sm:space-y-4">
        {contactInfo.map((info) => (
          <div key={info.label} className="flex items-start gap-3">
            <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-medium">{info.label}</p>
              <p className="text-sm sm:text-base text-muted-foreground break-words">
                {info.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Features Section
// ============================================================================

const FeaturesSection = () => {
  const features: FeatureItem[] = [
    {
      icon: Shield,
      title: 'Bảo mật thông tin',
      description: 'Thông tin của bạn được bảo vệ an toàn'
    },
    {
      icon: Clock,
      title: 'Hỗ trợ 24/7',
      description: 'Luôn sẵn sàng hỗ trợ khi bạn cần'
    },
    {
      icon: HelpCircle,
      title: 'Hướng dẫn sử dụng',
      description: 'Hướng dẫn chi tiết cách đặt vé'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 pt-8 border-t border-border">
      {features.map((feature) => (
        <div key={feature.title} className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm sm:text-base mb-1">{feature.title}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: Bottom Bar
// ============================================================================

const BottomBar = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright Information */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground text-center sm:text-left">
            <span>© {currentYear} Cinema Booking. Tất cả quyền được bảo lưu.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Được tạo với <Heart className="w-3 h-3 text-red-500" /> tại Việt Nam
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="w-8 h-8 sm:w-9 sm:h-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN FOOTER COMPONENT
// ============================================================================

const Footer = () => {
  // Data for footer links
  const quickLinks: FooterLink[] = [
    { name: 'Về chúng tôi', href: '/ve-chung-toi' },
    { name: 'Tin tức', href: '/tin-tuc' },
    { name: 'Tuyển dụng', href: '/tuyen-dung' },
    { name: 'Liên hệ', href: '/lien-he' },
    { name: 'Điều khoản sử dụng', href: '/dieu-khoan' },
    { name: 'Chính sách bảo mật', href: '/bao-mat' },
  ]

  const services: FooterLink[] = [
    { name: 'Đặt vé online', href: '/dat-ve' },
    { name: 'Thành viên VIP', href: '/vip' },
    { name: 'Khuyến mãi', href: '/khuyen-mai' },
    { name: 'Sự kiện', href: '/su-kien' },
    { name: 'Quà tặng', href: '/qua-tang' },
    { name: 'Hỗ trợ', href: '/ho-tro' },
  ]

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Grid Layout for Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Company Information */}
          <CompanyInfo />

          {/* Quick Links */}
          <FooterLinks title="Liên kết nhanh" links={quickLinks} />

          {/* Services */}
          <FooterLinks title="Dịch vụ" links={services} />

          {/* Contact & Support */}
          <ContactSupport />
        </div>

        {/* Features Section */}
        <FeaturesSection />
      </div>

      {/* Bottom Bar */}
      <BottomBar />
    </footer>
  )
}

export default Footer
