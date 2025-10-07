import React, { useState, useMemo } from "react";
import { ARTICLES, AUTHORS } from "./data";
import { SOCIALS } from "./config";

// Utility functions
function findAuthor(id) {
  return AUTHORS.find((a) => a.id === id) || AUTHORS[0];
}
function truncate(str, n = 140) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

// Logo component (SVG)
function Logo({ size = 40 }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shadow-sm"
      >
        <rect x="4" y="8" width="56" height="48" rx="6" fill="#F8FAFC" stroke="#1F2937" strokeWidth="1" />
        <path d="M16 22h32M16 30h32M16 38h20" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="18" r="2" fill="#1F2937" />
      </svg>
      <div className="leading-tight">
        <div className="text-sm font-semibold">الحوار الثقافي</div>
        <div className="text-xs text-gray-500">Cultural Dialogue</div>
      </div>
    </div>
  );
}

function Header({ lang, setLang, onSearch, onNavigate }) {
  const categories = ["أدب", "ثقافة", "رأي", "مقالات", "العرب والعالم", "أخبار"];
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate({ page: "home" })} className="flex items-center gap-3">
            <Logo />
          </button>

          <nav className="hidden md:flex gap-4 items-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => onNavigate({ page: "home", filterCategory: c })}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                {c}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              onChange={(e) => onSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث في المقالات..." : "Search articles..."}
              className="border rounded-md px-3 py-2 w-56 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="text-sm px-3 py-2 border rounded-md"
            >
              {lang === "ar" ? "EN" : "العربية"}
            </button>
            <button onClick={() => onNavigate({ page: "about" })} className="text-sm text-gray-600 hidden md:inline">
              {lang === "ar" ? "من نحن" : "About"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function ArticleCard({ art, lang, onOpen }) {
  const title = lang === "ar" ? art.title_ar : art.title_en;
  const excerpt = lang === "ar" ? art.excerpt_ar : art.excerpt_en;
  const author = findAuthor(art.authorId);

  return (
    <article className="border rounded-md p-4 hover:shadow-sm transition cursor-pointer bg-white" onClick={() => onOpen(art.id)}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{truncate(excerpt, 120)}</p>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <img src={author.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
        <div>
          <div>{lang === "ar" ? author.name_ar : author.name_en}</div>
          <div className="text-[11px]">{art.date} • {art.category}</div>
        </div>
      </div>
    </article>
  );
}

function AuthorPage({ authorId, lang, onNavigate }) {
  const author = findAuthor(authorId);
  const authorArticles = ARTICLES.filter((a) => a.authorId === authorId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex gap-6 items-center">
        <img src={author.avatar} className="w-28 h-28 rounded-md shadow" />
        <div>
          <h2 className="text-2xl font-semibold">{lang === "ar" ? author.name_ar : author.name_en}</h2>
          <p className="text-gray-600 mt-2">{lang === "ar" ? author.bio_ar : author.bio_en}</p>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">{lang === "ar" ? "مقالاته" : "Articles"}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {authorArticles.map((a) => (
            <ArticleCard key={a.id} art={a} lang={lang} onOpen={(id) => onNavigate({ page: "article", id })} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ArticlePage({ id, lang, onNavigate }) {
  const art = ARTICLES.find((x) => x.id === id) || ARTICLES[0];
  const title = lang === "ar" ? art.title_ar : art.title_en;
  const content = lang === "ar" ? art.content_ar : art.content_en;
  const author = findAuthor(art.authorId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="text-sm text-gray-500">{art.date}</div>
      </div>

      <div className="mt-4 text-gray-700 leading-relaxed">
        <p>{content}</p>
      </div>

      <div className="mt-8 border-t pt-6 flex items-center gap-4">
        <img src={author.avatar} className="w-12 h-12 rounded-full" />
        <div>
          <div className="font-semibold">{lang === "ar" ? author.name_ar : author.name_en}</div>
          <div className="text-sm text-gray-500">{lang === "ar" ? author.bio_ar : author.bio_en}</div>
        </div>
        <div className="flex-1 text-right">
          <button onClick={() => onNavigate({ page: "author", id: author.id })} className="text-sm text-blue-600">{lang === "ar" ? "المزيد عن الكاتب" : "More by author"}</button>
        </div>
      </div>
    </div>
  );
}

function Home({ lang, onOpenArticle, filterCategory }) {
  // group articles by category and pick latest 3
  const grouped = {};
  ARTICLES.forEach((a) => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });
  Object.keys(grouped).forEach((k) => grouped[k].sort((x, y) => new Date(y.date) - new Date(x.date)));

  const categories = ["أدب", "ثقافة", "رأي", "مقالات", "العرب والعالم", "أخبار"];
  const categoriesToShow = filterCategory ? [filterCategory] : categories;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">{lang === "ar" ? "آخر المقالات" : "Latest Articles"}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {ARTICLES.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} art={a} lang={lang} onOpen={onOpenArticle} />
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8">
        {categoriesToShow.map((cat) => (
          <section key={cat}>
            <h3 className="text-xl font-semibold mb-3">{cat}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {(grouped[cat] || []).slice(0, 3).map((a) => (
                <ArticleCard key={a.id} art={a} lang={lang} onOpen={onOpenArticle} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("ar");
  const [route, setRoute] = useState({ page: "home" });
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);

  const onNavigate = (r) => {
    setFilterCategory(r.filterCategory || null);
    setRoute({ page: r.page || "home", id: r.id || null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onOpenArticle = (id) => onNavigate({ page: "article", id });

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return ARTICLES.filter((a) => {
      const t = (lang === "ar" ? a.title_ar + a.excerpt_ar + a.content_ar : a.title_en + a.excerpt_en + a.content_en).toLowerCase();
      return t.includes(q);
    });
  }, [search, lang]);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 text-gray-900">
      <Header lang={lang} setLang={setLang} onSearch={setSearch} onNavigate={onNavigate} />

      <main className="py-8">
        {searchResults ? (
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-semibold mb-4">{lang === "ar" ? "نتائج البحث" : "Search Results"}</h2>
            {searchResults.length === 0 ? (
              <div className="text-gray-600">{lang === "ar" ? "لم تُعثر نتائج" : "No results found"}</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {searchResults.map((a) => (
                  <ArticleCard key={a.id} art={a} lang={lang} onOpen={onOpenArticle} />
                ))}
              </div>
            )}
          </div>
        ) : route.page === "home" ? (
          <Home lang={lang} onOpenArticle={onOpenArticle} filterCategory={filterCategory} />
        ) : route.page === "article" ? (
          <ArticlePage id={route.id} lang={lang} onNavigate={onNavigate} />
        ) : route.page === "author" ? (
          <AuthorPage authorId={route.id} lang={lang} onNavigate={onNavigate} />
        ) : route.page === "about" ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">{lang === "ar" ? "من نحن" : "About"}</h2>
            <p className="text-gray-700 leading-relaxed">{lang === "ar" ? "الحوار الثقافي منصة لمشاركة المقالات والتحليل الثقافي..." : "Cultural Dialogue is a platform for sharing essays and cultural analysis..."}</p>
          </div>
        ) : null}
      </main>

      <footer className="border-t bg-white border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">© {new Date().getFullYear()} الحوار الثقافي</div>
          <div className="text-sm text-gray-600">{lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}</div>
          <div className="flex items-center gap-4">
            {SOCIALS.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-900">{s.icon} <span className="sr-only">{s.name}</span></a>
            ))}
            <div className="text-sm text-gray-600"> | </div>
            <a href={"mailto:" + SOCIALS.find(x=>x.name==='Email').url} className="text-sm text-gray-600">{SOCIALS.find(x=>x.name==='Email').url}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
