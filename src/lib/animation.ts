import { gsap } from "gsap";

/**
 * Storefront Animations Helper
 */

export function flyToCart(sourceElement: HTMLElement, imageUrl?: string) {
  if (typeof window === "undefined" || !document) return;

  const isMobile = window.innerWidth < 768;
  let target = isMobile
    ? document.getElementById("cart-icon-bottom-target")
    : document.getElementById("cart-icon-target");

  if (!target) {
    target = document.getElementById("cart-icon-target") || document.getElementById("cart-icon-bottom-target");
  }

  if (!target) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  // Create a clone element to fly
  const flyer = document.createElement("div");
  flyer.style.position = "fixed";
  flyer.style.left = `${sourceRect.left + sourceRect.width / 2 - 20}px`;
  flyer.style.top = `${sourceRect.top + sourceRect.height / 2 - 20}px`;
  flyer.style.width = "40px";
  flyer.style.height = "40px";
  flyer.style.borderRadius = "50%";
  flyer.style.zIndex = "9999";
  flyer.style.pointerEvents = "none";
  
  if (imageUrl) {
    flyer.style.backgroundImage = `url(${imageUrl})`;
    flyer.style.backgroundSize = "cover";
    flyer.style.backgroundPosition = "center";
  } else {
    // Brand pink gradient fallback
    flyer.style.background = "linear-gradient(135deg, #b8848a, #7f3e47)";
  }
  
  flyer.style.border = "2px solid #7f3e47";
  flyer.style.boxShadow = "0 8px 24px rgba(127, 62, 71, 0.4)";
  flyer.style.transition = "transform 0.1s ease";

  document.body.appendChild(flyer);

  // Calculate translation path
  const xDiff = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const yDiff = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  // Animate using Web Animations API
  const animation = flyer.animate([
    {
      transform: "translate(0, 0) scale(1) rotate(0deg)",
      opacity: 1
    },
    {
      transform: `translate(${xDiff * 0.3}px, ${yDiff * 0.1 - 60}px) scale(1.2) rotate(45deg)`,
      opacity: 0.9,
      offset: 0.3
    },
    {
      transform: `translate(${xDiff}px, ${yDiff}px) scale(0.3) rotate(360deg)`,
      opacity: 0.2
    }
  ], {
    duration: 1300,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)"
  });

  const finalTarget = target;
  animation.onfinish = () => {
    flyer.remove();
    // Pulse/shake animation on target
    finalTarget.classList.add("cart-bounce");
    setTimeout(() => {
      finalTarget.classList.remove("cart-bounce");
    }, 500);
  };
}

export function runTruckAnimation(button: HTMLButtonElement, onCompleteCallback: () => void) {
  const box = button.querySelector('.box');
  const truck = button.querySelector('.truck');
  if (!box || !truck) {
    onCompleteCallback();
    return;
  }

  if (button.classList.contains('animation')) return;
  button.classList.add('animation');

  // GSAP animation sequences from reference
  gsap.to(button, {
    '--box-s': 1,
    '--box-o': 1,
    duration: 0.3,
    delay: 0.5
  });

  gsap.to(box, {
    x: 0,
    duration: 0.4,
    delay: 0.7
  });

  gsap.to(button, {
    '--hx': -5,
    '--bx': 50,
    duration: 0.18,
    delay: 0.92
  });

  gsap.to(box, {
    y: 0,
    duration: 0.1,
    delay: 1.15
  });

  gsap.set(button, {
    '--truck-y': 0,
    '--truck-y-n': -26
  });

  gsap.to(button, {
    '--truck-y': 1,
    '--truck-y-n': -25,
    duration: 0.2,
    delay: 1.25,
    onComplete() {
      gsap.timeline({
        onComplete() {
          button.classList.add('done');
          setTimeout(() => {
            // Reset button styles after confirmation
            button.classList.remove('animation', 'done');
            gsap.set(truck, { x: 4 });
            gsap.set(button, {
              '--progress': 0,
              '--hx': 0,
              '--bx': 0,
              '--box-s': 0.5,
              '--box-o': 0,
              '--truck-y': 0,
              '--truck-y-n': -26
            });
            gsap.set(box, { x: -24, y: -6 });
            
            // Execute order placed transitions
            onCompleteCallback();
          }, 1200); // 1.2s delay for "Order Placed" text and tick animation display
        }
      }).to(truck, {
        x: 0,
        duration: 0.4
      }).to(truck, {
        x: 40,
        duration: 1
      }).to(truck, {
        x: 20,
        duration: 0.6
      }).to(truck, {
        x: 96,
        duration: 0.4
      });

      gsap.to(button, {
        '--progress': 1,
        duration: 2.4,
        ease: "power2.in"
      });
    }
  });
}

