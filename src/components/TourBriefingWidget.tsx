"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import type { UpcomingTour } from "@/lib/met-tour";

export default function TourBriefingWidget() {
  const [tours, setTours] = useState<UpcomingTour[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/tours")
      .then((r) => r.json())
      .then((d) => { setTours(d.upcoming ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <p className="section-label">🎨 大都会导览简报</p>
          {!loading && tours.length > 0 && (
            <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full tabular-nums">
              {tours.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="text-[rgb(var(--text-3))] hover:text-[rgb(var(--text))] transition-colors"
            title="刷新"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <a
            href="http://localhost:3000/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-[rgb(var(--text-3))] hover:text-[rgb(var(--text))] transition-colors"
          >
            后台管理 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {loading ? (
        <div className="border border-[rgb(var(--border))] p-6 text-center">
          <p className="text-xs text-[rgb(var(--text-3))]">加载中...</p>
        </div>
      ) : tours.length === 0 ? (
        <div className="border border-[rgb(var(--border))] p-6 text-center">
          <p className="text-sm text-[rgb(var(--text-3))]">暂无已确认的导览安排</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tours.map((t, idx) => {
            const tourDate = new Date(t.tourDate);
            const daysUntil = Math.ceil((tourDate.getTime() - Date.now()) / 86400000);
            const daysLabel = daysUntil === 0 ? "今天" : daysUntil === 1 ? "明天" : `${daysUntil} 天后`;
            const isNext = idx === 0;

            return (
              <div
                key={t.id}
                className={`border rounded-sm ${isNext ? "border-red-500/40 bg-red-500/[0.03] dark:bg-red-400/[0.04]" : "border-[rgb(var(--border))]"}`}
              >
                {/* 日期条 */}
                <div className={`flex items-center justify-between px-4 py-2 border-b ${isNext ? "border-red-500/20" : "border-[rgb(var(--border))]"}`}>
                  <div className="flex items-center gap-2">
                    {isNext && <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-red-500">下次</span>}
                    <span className="text-xs font-semibold text-[rgb(var(--text))]">
                      {tourDate.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" })}
                      {t.timeSlot && <span className="ml-2 font-normal text-[rgb(var(--text-2))]">{t.timeSlot}</span>}
                    </span>
                  </div>
                  <span className={`text-[10px] tabular-nums ${daysUntil <= 2 ? "text-red-500 font-bold" : "text-[rgb(var(--text-3))]"}`}>
                    {daysLabel}
                  </span>
                </div>

                {/* 内容 */}
                <div className="px-4 py-3 grid grid-cols-3 gap-4">
                  {/* 访客 */}
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[rgb(var(--text-3))] mb-1">访客</p>
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">{t.name}</p>
                    <p className="text-[11px] text-[rgb(var(--text-3))] mt-0.5">{t.email}</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-xl font-bold tabular-nums text-red-500">{t.groupSize}</span>
                      <span className="text-xs text-[rgb(var(--text-3))]">人</span>
                    </div>
                  </div>

                  {/* 预期 */}
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[rgb(var(--text-3))] mb-1">预期</p>
                    {t.profileTag && (
                      <span className="inline-block text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-sm mb-1.5">
                        {t.profileTag}
                      </span>
                    )}
                    {t.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {t.interests.map((i) => (
                          <span key={i} className="text-[10px] border border-[rgb(var(--border))] text-[rgb(var(--text-2))] px-1.5 py-0.5 rounded-sm">
                            {i}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[rgb(var(--text-3))]">未填问卷</p>
                    )}
                    {t.openQuestion && (
                      <p className="text-[10px] text-[rgb(var(--text-2))] mt-1.5 italic border-l border-red-400/40 pl-2 leading-relaxed">
                        「{t.openQuestion}」
                      </p>
                    )}
                    {(t.knowledgeLevel || t.firstVisit || t.country) && (
                      <div className="flex gap-2 mt-1.5 text-[9px] text-[rgb(var(--text-3))]">
                        {t.firstVisit === "yes" && <span>首次</span>}
                        {t.knowledgeLevel && <span>{t.knowledgeLevel}</span>}
                        {t.country && <span>{t.country}</span>}
                      </div>
                    )}
                  </div>

                  {/* 需求 & 支付 */}
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[rgb(var(--text-3))] mb-1">需求 & 支付</p>
                    {t.notes ? (
                      <p className="text-[11px] text-[rgb(var(--text))] bg-yellow-500/[0.08] border border-yellow-400/30 rounded-sm px-2 py-1.5 leading-relaxed">
                        {t.notes}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[rgb(var(--text-3))]">无特殊需求</p>
                    )}
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-sm font-semibold text-[rgb(var(--text))]">${t.amount}</span>
                      <span className="text-[10px] text-[rgb(var(--text-3))]">
                        {t.paymentType === "full" ? "全额" : t.paymentType === "deposit" ? "定金" : t.paymentType}
                      </span>
                    </div>
                    {t.bookingCode && (
                      <p className="text-[9px] text-[rgb(var(--text-3))] tracking-widest mt-0.5"># {t.bookingCode}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
