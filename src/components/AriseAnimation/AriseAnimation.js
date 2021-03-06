/* eslint-disable default-case */
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useEffect } from 'react';

export const animationTypes = {
   FROM_LEFT: 'fromLeft',
   FROM_RIGHT: 'fromRight',
   FROM_TOP: 'fromTop',
   FROM_BOTTOM: 'fromBottom',
   ZOOM_IN: 'zoomIn',
   ZOOM_OUT: 'zoomOut',
   ROTATE_LEFT: 'rotateLeft',
   ROTATE_RIGHT: 'rotateRight',
   FLIP_HR: 'flipHr',
   FLIP_VR: 'flipVr',
   FLIP_DG: 'flipDg',
};

export function getKeyFrames(animationType = 'fadeIn') {
   // Translate, percentage
   const translate = 50;
   // Rotate, degrees
   const rotate = 90;

   let keyframesBase = [{ opacity: 0 }, { opacity: 0.2 }, { opacity: 1 }];

   if (animationType === 'fadeIn') return keyframesBase;

   let template, initial;
   const steps = [1, 0.4, 0];

   // For template
   switch (animationType) {
      // Move
      case animationTypes.FROM_LEFT:
         template = 'translateX(-$%)';
         break;
      case animationTypes.FROM_TOP:
         template = 'translateY(-$%)';
         break;
      case animationTypes.FROM_RIGHT:
         template = 'translateX($%)';
         break;
      case animationTypes.FROM_BOTTOM:
         template = 'translateY($%)';
         break;
      // Zoom
      case animationTypes.ZOOM_IN:
      case animationTypes.ZOOM_OUT:
         template = 'scale($)';
         break;
      // Rotate
      case animationTypes.ROTATE_LEFT:
         template = 'rotate(-$deg)';
         break;
      case animationTypes.ROTATE_RIGHT:
         template = 'rotate($deg)';
         break;
      case animationTypes.FLIP_HR:
         template = 'rotate3D(0,1,0,$deg)';
         break;
      case animationTypes.FLIP_VR:
         template = 'rotate3D(1,0,0,$deg)';
         break;
      case animationTypes.FLIP_DG:
         template = 'rotate3D(1,1,0,-$deg)';
         break;
   }

   switch (animationType) {
      // Move
      case animationTypes.FROM_LEFT:
      case animationTypes.FROM_TOP:
      case animationTypes.FROM_RIGHT:
      case animationTypes.FROM_BOTTOM:
         initial = translate;
         break;
      // Rotate
      case animationTypes.ROTATE_LEFT:
      case animationTypes.ROTATE_RIGHT:
      case animationTypes.FLIP_HR:
      case animationTypes.FLIP_VR:
      case animationTypes.FLIP_DG:
         initial = rotate;
         break;
   }

   const keyframes = keyframesBase.map((frame, index) => {
      let transformValue, value;

      switch (animationType) {
         case animationTypes.ZOOM_IN:
            value = (1 - steps[index]).toFixed(2);
            transformValue = value === '1.00' ? 'none' : value;
            break;
         case animationTypes.ZOOM_OUT:
            value = (1 + steps[index]).toFixed(2);
            transformValue = value === '1.00' ? 'none' : value;
            break;
         default:
            value = (initial * steps[index]).toFixed(0);
            transformValue = value === '0' ? 'none' : value;
            break;
      }

      const transform =
         transformValue === 'none'
            ? transformValue
            : template.replace('$', transformValue);
      return { ...frame, transform };
   });

   return keyframes;
}

// Component
export default function AriseAnimation({
   fire,
   className,
   children,
   animationType,
   fixed = false,
   delay = 0,
   duration = 500,
}) {
   const options = {
      delay,
      duration,
      easing: 'ease-in-out',
      fill: 'forwards',
   };

   const fireState = useRef(false);
   const ref = useRef();

   // Play animation effects
   useEffect(() => {
      if (fireState.current === false && fire === true && !fixed) {
         ref.current.animate(getKeyFrames(animationType), {
            ...options,
            direction: 'normal',
         });
      }
      if (fireState.current === true && fire === false && !fixed) {
         ref.current.animate(getKeyFrames(animationType), {
            ...options,
            direction: 'reverse',
         });
      }
      if (fireState.current !== fire && !fixed) {
         fireState.current = fire;
      }
   });

   return (
      <div className={className} style={{ opacity: fixed ? 1 : 0 }} ref={ref}>
         {children}
      </div>
   );
}

AriseAnimation.propTypes = {
   fire: PropTypes.bool,
   className: PropTypes.string,
   children: PropTypes.node,
   animationType: PropTypes.string,
   fixed: PropTypes.bool,
   delay: PropTypes.number,
   duration: PropTypes.number,
};
