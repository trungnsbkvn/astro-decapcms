# Internationalization (i18n) Content Markup Guide

## Overview

This website uses a **hybrid internationalization system**:
- **Professional Translations (i18n)**: All fixed UI elements (navigation, buttons, labels, headers)
- **Google Translate**: Dynamic CMS content (blog posts, news, legal pages, evaluation forms, etc.)

This approach minimizes translation overhead while ensuring all content can be accessed in 5 languages:
- Vietnamese (`vi`) - Default, zero overhead
- English (`en`)
- Chinese (`zh`)
- Japanese (`ja`)
- Korean (`ko`)

## Core Principles

### 1. UI Elements Use i18n (Vietnamese Only)
All static UI text stays in Vietnamese with professional `i18n` translations:
```astro
<!-- ✅ CORRECT: UI labels use Vietnamese with i18n class -->
<span class="notranslate" translate="no">Tác giả:</span>
```

### 2. CMS Content Uses Google Translate (Dynamic)
All user-generated and CMS-based content uses Google Translate for all languages:
```astro
<!-- ✅ CORRECT: CMS content marked for translation -->
<h1 class="user-content" data-user-content translate="yes">
  {post.title}
</h1>
```

### 3. Protection with `notranslate` Attribute
Prevent unintended translation with dual attributes:
```astro
<!-- ✅ CORRECT: Fully protected from translation -->
<span class="notranslate" translate="no">Fixed Text</span>

<!-- ✅ ALSO CORRECT: Just the HTML attribute -->
<span translate="no">Fixed Text</span>

<!-- ❌ WRONG: Missing protection -->
<span>This will be translated</span>
```

## Markup Patterns by Content Type

### Blog Posts / News Articles

**Location**: `src/components/blog/SinglePost.astro`

```astro
<!-- Header metadata - UI labels protected, content marked for translation -->
<header>
  <div class="metadata">
    <!-- Date: NO translation needed -->
    <time datetime={String(post.publishDate)}>
      {getFormattedDate(post.publishDate)}
    </time>

    <!-- "Tác giả:" label - PROTECTED from translation -->
    <span class="notranslate" translate="no">Tác giả:</span>
    
    <!-- Author name - MARKED for translation (might be translated to other names) -->
    <a class="user-content" data-user-content translate="yes" href={...}>
      <b>{post.author}</b>
    </a>

    <!-- "phút đọc" label - PROTECTED -->
    <span class="notranslate" translate="no">phút đọc</span>
  </div>

  <!-- Title - MARKED for translation -->
  <h1 class="user-content" data-user-content translate="yes">
    {post.title}
  </h1>

  <!-- Excerpt - MARKED for translation -->
  <p class="user-content" data-user-content translate="yes">
    {post.excerpt}
  </p>
</header>

<!-- Main content - MARKED for translation -->
<article class="user-content" data-user-content translate="yes">
  <div class="prose">
    <slot />  <!-- Post markdown content -->
  </div>
</article>

<!-- Tags and sharing - UI labels protected, content marked -->
<div class="flex justify-between">
  <PostTags tags={post.tags} class="user-content" />
  <SocialShare url={url} text={post.title} />
</div>
```

### Legal Services / Practice Areas

**Location**: `src/pages/phap-ly/` or similar

```astro
<!-- Service header - MARKED for translation -->
<section class="user-content" data-user-content translate="yes">
  <h1>{serviceTitle}</h1>
  <p>{serviceDescription}</p>
</section>

<!-- Service content - MARKED for translation -->
<article class="user-content" data-user-content translate="yes">
  <h2>Dịch vụ chúng tôi cung cấp</h2>
  <ul>
    {services.map(service => <li>{service}</li>)}
  </ul>
</article>

<!-- Contact CTA - Mixed: button text protected, dynamic content marked -->
<section class="notranslate" translate="no">
  <h2>Liên hệ với chúng tôi</h2>
  <a href="/contact" class="btn">Yêu cầu tư vấn</a>
</section>
```

### Evaluation Forms

**Location**: `src/pages/dich-vu-danh-gia/` or form components

```astro
<!-- Form instructions - UI labels protected -->
<form class="evaluation-form">
  <!-- Form labels stay in Vietnamese -->
  <label class="notranslate" translate="no">
    Tên công ty:
  </label>
  <input type="text" />

  <!-- Form content/user input - MARKED for translation -->
  <label class="notranslate" translate="no">
    Mô tả doanh nghiệp:
  </label>
  <textarea class="user-content" data-user-content translate="yes"></textarea>

  <!-- Results/output - MARKED for translation -->
  <div class="evaluation-results user-content" data-user-content translate="yes">
    {evaluationContent}
  </div>
</form>
```

### Investment/Labor Pages

**Location**: `src/pages/dau-tu-nuoc-ngoai/` or `src/pages/lao-dong/`

```astro
<!-- Navigation/headers - PROTECTED -->
<div class="breadcrumb notranslate" translate="no">
  <a href="/">Trang chủ</a>
  <span>/</span>
  <a href="/dau-tu-nuoc-ngoai">Đầu tư nước ngoài</a>
</div>

<!-- Page content - MARKED for translation -->
<main class="user-content" data-user-content translate="yes">
  <h1>Hướng dẫn đầu tư nước ngoài</h1>
  <p>Nội dung chi tiết...</p>
  
  <h2>Các bước cần thiết</h2>
  <ol>
    <li>Bước 1...</li>
    <li>Bước 2...</li>
  </ol>
</main>

<!-- Related posts/links - MARKED for translation -->
<section class="user-content" data-user-content translate="yes">
  <h3>Bài viết liên quan</h3>
  {relatedPosts.map(post => (
    <a href={post.url}>{post.title}</a>
  ))}
</section>
```

## Component-Specific Guidelines

### Header Component
**Location**: `src/components/widgets/Header.astro`

```astro
<!-- ALWAYS add notranslate to header -->
<header class="notranslate" translate="no">
  <nav>
    <a href="/">Trang chủ</a>
    <a href="/phap-ly">Pháp lý</a>
    <a href="/lao-dong">Lao động</a>
  </nav>
  
  <!-- LanguageSelector is included here - it's protected -->
  <LanguageSelector />
</header>
```

✅ **Status**: Already updated with `notranslate` and `translate="no"`

### Footer Component
**Location**: `src/components/widgets/Footer.astro`

```astro
<!-- ALWAYS add notranslate to footer -->
<footer class="notranslate" translate="no">
  <div>
    <p>Công ty Luật TNHH Youth & Partners</p>
    <p>Hotline: 088 995 6888</p>
    <p>Email: contact@yplawfirm.vn</p>
  </div>
  
  <nav>
    <a href="/privacy">Chính sách bảo mật</a>
    <a href="/terms">Điều khoản sử dụng</a>
  </nav>
</footer>
```

✅ **Status**: Already updated with `notranslate` and `translate="no"`

### LanguageSelector Component
**Location**: `src/components/common/LanguageSelector.astro`

```astro
<!-- Language selector is ALWAYS protected -->
<div class="language-selector notranslate" translate="no">
  <button data-language-selector>
    <Icon name="tabler:world" />
    VN
    <Icon name="tabler:chevron-down" />
  </button>
  <div class="dropdown">
    <div class="option" data-lang="vi">🇻🇳 Tiếng Việt</div>
    <div class="option" data-lang="en">🇬🇧 English</div>
    <div class="option" data-lang="zh">🇨🇳 中文</div>
    <div class="option" data-lang="ja">🇯🇵 日本語</div>
    <div class="option" data-lang="ko">🇰🇷 한국어</div>
  </div>
</div>
```

✅ **Status**: Implemented with full protection

### Navigation / Breadcrumbs
**Pattern**: These are UI elements, always protect them

```astro
<!-- ✅ CORRECT: Navigation is protected -->
<nav class="notranslate" translate="no">
  <a href="/">Trang chủ</a>
  <span>/</span>
  <a href="/phap-ly">Pháp lý</a>
  <span>/</span>
  <a href="/phap-ly/hop-dong">Hợp đồng</a>
</nav>

<!-- ❌ WRONG: Navigation would be translated -->
<nav>
  <a href="/">Trang chủ</a>
</nav>
```

## Implementation Checklist

### When Creating New Content Pages:

- [ ] Wrap page title and content in `class="user-content" data-user-content translate="yes"`
- [ ] Protect navigation/breadcrumbs with `class="notranslate" translate="no"`
- [ ] Protect form labels with `class="notranslate" translate="no"`
- [ ] Protect buttons/CTAs with `class="notranslate" translate="no"` for labels
- [ ] Protect dates/phone numbers/emails in formatted sections
- [ ] Wrap user-generated content in `class="user-content"`
- [ ] Verify no content is double-wrapped (i18n + Google Translate)

### When Creating New Components:

- [ ] If it's a **UI component** (Button, Input, Modal): Use i18n for all text
- [ ] If it's a **content component** (BlogPost, Card, Profile): Wrap dynamic content in `user-content`
- [ ] If it's a **layout wrapper** (Header, Footer, Sidebar): Add `notranslate` to root element

## Google Translate Behavior

When a user selects a non-Vietnamese language:

1. **Page reloads** with Google Translate activated
2. **All elements with `user-content` class** are automatically translated by Google
3. **All elements with `notranslate` class** remain in Vietnamese (UI text)
4. **TranslationNotice** appears at the bottom for 3 seconds

### How It Works:
```javascript
// User clicks "English" button
// 1. Save preference to localStorage
saveLang('en');

// 2. Set Google Translate cookie
setGTCookie('en');  // Sets googtrans cookie to /vi/en

// 3. Reload page
window.location.reload();

// 4. On page load, EarlyTranslationScript initializes Google Translate
// 5. Google Translate processes all elements NOT marked with notranslate
// 6. TranslationNotice appears and auto-dismisses after 3 seconds
```

## Testing

### To verify your markup:

1. **Open DevTools** (F12)
2. **Search for elements** with these classes:
   - `notranslate` - Should see all UI elements (nav, buttons, labels)
   - `user-content` - Should see all CMS/dynamic content (posts, titles, etc.)
3. **Change language** to non-Vietnamese
4. **Refresh page** and check:
   - UI text stays Vietnamese
   - Content text is translated
   - No double-translation or gaps

### Common Issues:

| Issue | Cause | Solution |
|-------|-------|----------|
| UI text is translated | Missing `notranslate` | Add `class="notranslate" translate="no"` |
| Content is NOT translated | Missing `user-content` | Add `class="user-content" data-user-content translate="yes"` |
| Double translation/garbled | Both `notranslate` and `user-content` on same element | Use only ONE attribute |
| Language doesn't change | localStorage not working | Check browser console for errors |
| Notice doesn't show | TranslationNotice.astro not included | Verify it's in Layout.astro |

## Files Modified

✅ **src/components/blog/SinglePost.astro** - Added user-content and notranslate attributes
✅ **src/components/widgets/Footer.astro** - Added notranslate and translate="no"
✅ **src/components/widgets/Header.astro** - Already has notranslate
✅ **src/components/common/LanguageSelector.astro** - Reference implementation with full protection
✅ **src/components/common/EarlyTranslationScript.astro** - Prevents FOUC
✅ **src/components/common/TranslationNotice.astro** - Auto-dismisses after 3 seconds
✅ **src/layouts/Layout.astro** - Includes scripts in correct order

## Next Steps

1. ✅ Review this guide
2. ✅ Apply markup patterns to all CMS content pages:
   - Blog/news templates
   - Legal service pages
   - Evaluation forms
   - Investment/labor pages
3. ✅ Test language switching and content translation
4. ✅ Run `npm run build` to verify no errors
5. ✅ Deploy and monitor for translation issues
