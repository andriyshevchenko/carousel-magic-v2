import { memo } from 'react';
import { getTheme } from '../data/themes';
import {
    PFP_SIZE,
    type ProfilePicConfig,
} from '../types/profilePic';
import { resolveTheme } from '../utils/slideLayout';

interface ProfilePicCanvasProps {
  readonly config: ProfilePicConfig;
  readonly renderSize: number;
  readonly fullSize?: boolean;
}

function ProfilePicCanvas({ config, renderSize, fullSize }: ProfilePicCanvasProps) {
  const size = fullSize ? PFP_SIZE : renderSize;
  const scale = fullSize ? 1 : renderSize / PFP_SIZE;

  const bgStyle = getBackgroundStyle(config);

  return (
    <div
      className="profile-pic-canvas"
      style={{
        width: size,
        height: size,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: config.circlePreview && !fullSize ? '50%' : 0,
        ...bgStyle,
      }}
    >
      {/* Vignette overlay — darkens edges for depth */}
      {config.vignette && config.processedImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 40%, transparent 30%, rgba(0,0,0,0.25) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* The processed (bg-removed) image */}
      {config.processedImage && (
        <img
          src={config.processedImage}
          alt="Profile"
          draggable={false}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${config.offsetX * scale}px), calc(-50% + ${config.offsetY * scale}px)) scale(${config.imageScale})`,
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            userSelect: 'none',
            filter: config.edgeSoftening > 0 ? `drop-shadow(0 0 ${config.edgeSoftening * 0.5}px rgba(0,0,0,0.4))` : undefined,
            zIndex: 1,
          }}
        />
      )}

      {/* Drop shadow layer behind the person */}
      {config.dropShadow && config.processedImage && (
        <img
          src={config.processedImage}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${config.offsetX * scale}px), calc(-50% + ${(config.offsetY + 3) * scale}px)) scale(${config.imageScale})`,
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            filter: 'blur(8px) brightness(0) opacity(0.2)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Show original image if no processed version yet */}
      {!config.processedImage && config.originalImage && (
        <img
          src={config.originalImage}
          alt="Original"
          draggable={false}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${config.offsetX * scale}px), calc(-50% + ${config.offsetY * scale}px)) scale(${config.imageScale})`,
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            opacity: config.processing ? 0.4 : 1,
            userSelect: 'none',
          }}
        />
      )}

      {/* Processing overlay */}
      {config.processing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontSize: 14 * scale,
            gap: 8 * scale,
          }}
        >
          <div style={{ fontSize: 24 * scale }} className="animate-spin">⏳</div>
          <div style={{ fontSize: 12 * scale, opacity: 0.8 }}>
            {config.modelLoading ? 'Loading AI model...' : 'Removing background...'}
          </div>
          {config.progress > 0 && (
            <div
              style={{
                width: '60%',
                height: 4 * scale,
                borderRadius: 2 * scale,
                background: 'rgba(255,255,255,0.2)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${config.progress}%`,
                  background: '#82aaff',
                  borderRadius: 2 * scale,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!config.originalImage && !config.processedImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14 * scale,
            gap: 8 * scale,
          }}
        >
          <div style={{ fontSize: 40 * scale }}>📷</div>
          <div style={{ fontSize: 12 * scale }}>Upload a photo to get started</div>
        </div>
      )}
    </div>
  );
}

function getBackgroundStyle(config: ProfilePicConfig): React.CSSProperties {
  switch (config.backgroundType) {
    case 'solid':
      return { backgroundColor: config.solidColor };
    case 'gradient':
      return {
        backgroundImage: `linear-gradient(${config.gradientAngle}deg, ${config.gradientStart}, ${config.gradientEnd})`,
      };
    case 'theme-match': {
      const rawTheme = getTheme(config.themeId);
      const theme = resolveTheme(rawTheme);
      return { backgroundColor: theme.bg };
    }
    default:
      return { backgroundColor: '#011627' };
  }
}

export default memo(ProfilePicCanvas);
