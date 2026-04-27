import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { uploadImage } from '@/services/storageService';
import { addContactMessage } from '@/services/contactService';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  // Contact information
  const phoneNumber = '+201016434958';
  const whatsappNumber = '201016434958'; // Without + for WhatsApp
  const email = 'pickiofurniture@gmail.com';
  const address = '٧ شارع عصمت الخضري متفرع من شارع النزهه خلف معرض سيارات الليثي للسيارات مدينة نصر';
  const googleMapsEmbed = 'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d215.7780410508913!2d31.34049276094898!3d30.081334548448968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1z2acg2LTYp9ix2Lkg2LnYtdmF2Kog2KfZhNiu2LbYsdmKINmF2KrZgdix2Lkg2YXZhiDYtNin2LHYuSDYp9mE2YbYstmH2Ycg2K7ZhNmBINmF2LnYsdi2INiz2YrYp9ix2KfYqiDYp9mE2YTZitir2Yog2YTZhNiz2YrYp9ix2KfYqiDZhdiv2YrZhtipINmG2LXYsQ!5e0!3m2!1sen!2seg!4v1769039990865!5m2!1sen!2seg';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(isRTL ? 'الملف يجب أن يكون صورة' : 'File must be an image');
        return;
      }
      
      // Validate file size (max 5MB before compression, will be compressed to 100KB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB before compression
      const TARGET_SIZE = 100 * 1024; // 100KB after compression
      if (file.size > MAX_FILE_SIZE) {
        toast.error(isRTL ? `حجم الصورة كبير جداً (سيتم ضغطها إلى ${TARGET_SIZE / 1024}KB)` : `Image size too large (will be compressed to ${TARGET_SIZE / 1024}KB)`);
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || 
        !formData.subject.trim() || !formData.message.trim()) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    
    setIsSending(true);

    try {
      let uploadedImageUrl: string | undefined;
      
      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        try {
          uploadedImageUrl = await uploadImage(selectedImage, 'contact-requests');
          setImageUrl(uploadedImageUrl);
          toast.success(isRTL ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
        } catch (error: any) {
          toast.error(isRTL ? 'فشل رفع الصورة' : 'Failed to upload image');
          setUploadingImage(false);
          setIsSending(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }
      
      // Save to Firestore
      await addContactMessage({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        imageUrl: uploadedImageUrl,
      });
      
      // Also create mailto link for email client
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email}\n\n` +
        `Message:\n${formData.message}` +
        (uploadedImageUrl ? `\n\nImage: ${uploadedImageUrl}` : '')
      );
      
      // Open email client
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      
      // Show success message
      setIsSubmitted(true);
      toast.success(isRTL ? 'تم إرسال الرسالة بنجاح!' : 'Message sent successfully!');
      
      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: '',
        });
        handleRemoveImage();
      }, 3000);
    } catch (error: any) {
      toast.error(isRTL ? 'حدث خطأ أثناء إرسال الرسالة' : 'Error sending message');
    } finally {
      setIsSending(false);
    }
  };

  const handleWhatsApp = () => {
    const message = isRTL 
      ? `مرحباً، أريد التواصل معكم بخصوص: ${formData.subject || 'استفسار عام'}`
      : `Hello, I would like to contact you regarding: ${formData.subject || 'General inquiry'}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success(isRTL ? 'جاري فتح واتساب...' : 'Opening WhatsApp...');
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: isRTL ? 'العنوان' : 'Address',
      content: address,
    },
    {
      icon: Phone,
      title: isRTL ? 'الهاتف / واتساب' : 'Phone / WhatsApp',
      content: phoneNumber,
      dir: 'ltr',
      link: `tel:${phoneNumber}`,
      whatsapp: true,
    },
    {
      icon: Mail,
      title: isRTL ? 'البريد الإلكتروني' : 'Email',
      content: email,
      link: `mailto:${email}`,
    },
    {
      icon: Clock,
      title: isRTL ? 'ساعات العمل' : 'Working Hours',
      content: isRTL ? 'السبت - الخميس: 10ص - 10م' : 'Sat - Thu: 10AM - 10PM',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl"
            >
              {t('footer.contactUs')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              {isRTL
                ? 'نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت.'
                : "We're here to help. Get in touch and we'll respond as soon as possible."}
            </motion.p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-3xl bg-card p-6 shadow-card md:p-8">
                <h2 className="mb-6 text-2xl font-semibold text-foreground">
                  {isRTL ? 'أرسل رسالة' : 'Send a Message'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {isRTL ? 'الاسم' : 'Name'} *
                      </label>
                      <Input
                        placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        {isRTL ? 'الهاتف' : 'Phone'} *
                      </label>
                      <Input
                        type="tel"
                        placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone'}
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      {isRTL ? 'البريد الإلكتروني' : 'Email'} *
                    </label>
                    <Input
                      type="email"
                      placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      {isRTL ? 'الموضوع' : 'Subject'} *
                    </label>
                    <Input
                      placeholder={isRTL ? 'موضوع الرسالة' : 'Message subject'}
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      {isRTL ? 'الرسالة' : 'Message'} *
                    </label>
                    <Textarea
                      placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Image Upload */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      {isRTL ? 'صورة المنتج المطلوب (اختياري)' : 'Product Image (Optional)'}
                    </label>
                    <div className="space-y-3">
                      {!imagePreview ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:border-primary hover:bg-muted"
                        >
                          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground text-center">
                            {isRTL 
                              ? 'انقر لرفع صورة المنتج الذي تريد تصنيعه'
                              : 'Click to upload product image you want to make'}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {isRTL ? 'PNG, JPG, GIF حتى 10MB' : 'PNG, JPG, GIF up to 10MB'}
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative overflow-hidden rounded-lg border border-border">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-48 w-full object-cover"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute right-2 top-2"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {uploadingImage && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {isRTL ? 'جاري رفع الصورة...' : 'Uploading image...'}
                            </div>
                          )}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 gap-2"
                      disabled={isSubmitted || isSending || uploadingImage}
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          {isRTL ? 'تم الإرسال!' : 'Sent!'}
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {isRTL ? 'إرسال عبر البريد' : 'Send via Email'}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="gap-2"
                      onClick={handleWhatsApp}
                      disabled={!formData.subject && !formData.message}
                    >
                      <MessageCircle className="h-5 w-5" />
                      {isRTL ? 'واتساب' : 'WhatsApp'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-card p-6 shadow-card"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {info.title}
                    </h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        dir={info.dir || undefined}
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p
                        className="text-sm text-muted-foreground"
                        dir={info.dir || undefined}
                      >
                        {info.content}
                      </p>
                    )}
                    {info.whatsapp && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 w-full gap-2"
                        onClick={() => {
                          const whatsappUrl = `https://wa.me/${whatsappNumber}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        {isRTL ? 'فتح واتساب' : 'Open WhatsApp'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Google Maps */}
              <div className="overflow-hidden rounded-3xl bg-muted">
                <iframe
                  src={googleMapsEmbed}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title={isRTL ? 'خريطة الموقع' : 'Location Map'}
                />
              </div>
              
              {/* Map Link */}
              <div className="text-center">
                <a
                  href="https://maps.app.goo.gl/mdKoLkwmp8qC54kg6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  {isRTL ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                </a>
              </div>

              {/* Quick Contact Buttons */}
              <div className="rounded-2xl bg-secondary p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  {isRTL ? 'تواصل معنا مباشرة' : 'Contact Us Directly'}
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/${whatsappNumber}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <MessageCircle className="h-5 w-5" />
                    {isRTL ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      window.location.href = `mailto:${email}`;
                    }}
                  >
                    <Mail className="h-5 w-5" />
                    {isRTL ? 'إرسال بريد إلكتروني' : 'Send Email'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      window.location.href = `tel:${phoneNumber}`;
                    }}
                  >
                    <Phone className="h-5 w-5" />
                    {isRTL ? 'اتصل بنا' : 'Call Us'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Contact;
