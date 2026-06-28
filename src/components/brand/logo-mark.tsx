"use client";

import { useId } from "react";

const BODY_PATH =
  "M 78 66 A 76 76 0 0 1 154 142 V 138 A 22 22 0 0 1 132 160 H 24 A 22 22 0 0 1 2 138 V 142 A 76 76 0 0 1 78 66 Z";

type LogoMarkProps = {
  size?: number;
  className?: string;
};

/**
 * BoringBrush bust mark — shared SVG for navbar, footer, and favicon.
 * Paint order matches BoringBrush Logo.html: base → body → head → split line.
 */
export function LogoMark({ size = 40, className }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const bodyId = `bb-body-${uid}`;
  const rainbowId = `bb-rainbow-${uid}`;
  const leftId = `bb-left-${uid}`;
  const rightId = `bb-right-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      className={className}
      aria-hidden
      style={{ flexShrink: 0, display: "block" }}
    >
      <defs>
        <linearGradient id={rainbowId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ca2b1c" />
          <stop offset="28%" stopColor="#e8862e" />
          <stop offset="50%" stopColor="#ffd544" />
          <stop offset="74%" stopColor="#2b8d65" />
          <stop offset="100%" stopColor="#67548f" />
        </linearGradient>
        <clipPath id={leftId}>
          <rect x="0" y="0" width="78" height="174" />
        </clipPath>
        <clipPath id={rightId}>
          <rect x="78" y="0" width="78" height="174" />
        </clipPath>
        <path id={bodyId} d={BODY_PATH} />
      </defs>

      <rect width="240" height="240" rx="50" fill="#a1e5f5" />
      <rect
        x="4"
        y="4"
        width="232"
        height="232"
        rx="42"
        fill="none"
        stroke="#15110a"
        strokeWidth="8"
      />

      <g transform="translate(42, 32)">
        <ellipse
          cx="78"
          cy="159"
          rx="62"
          ry="12"
          fill="#6f6f6f"
          stroke="#15110a"
          strokeWidth="6"
        />

        <g clipPath={`url(#${leftId})`}>
          <use href={`#${bodyId}`} fill="#8e8e8e" />
        </g>
        <g clipPath={`url(#${rightId})`}>
          <use href={`#${bodyId}`} fill={`url(#${rainbowId})`} />
        </g>
        <use href={`#${bodyId}`} fill="none" stroke="#15110a" strokeWidth="6" />

        <g clipPath={`url(#${leftId})`}>
          <circle cx="78" cy="45" r="42" fill="#8e8e8e" />
        </g>
        <g clipPath={`url(#${rightId})`}>
          <circle cx="78" cy="45" r="42" fill={`url(#${rainbowId})`} />
        </g>
        <circle
          cx="78"
          cy="45"
          r="42"
          fill="none"
          stroke="#15110a"
          strokeWidth="6"
        />

        <rect x="76" y="8" width="4" height="150" rx="2" fill="#15110a" />
      </g>
    </svg>
  );
}
