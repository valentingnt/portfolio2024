<script setup lang="ts">
interface Toast {
  id: number
  title: string
  description: string
}

const MAX_TOASTS = 3
const toasts = ref<Toast[]>([])
let toastId = 0

const showToast = (title: string, description: string) => {
  const id = toastId++
  toasts.value.unshift({ id, title, description })

  // Keep only the 3 most recent toasts
  if (toasts.value.length > MAX_TOASTS) {
    toasts.value = toasts.value.slice(0, MAX_TOASTS)
  }

  setTimeout(() => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }, 5000)
}

function dismissToast(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

defineExpose({ showToast })
</script>

<template>
  <div class="ToastContainer">
    <TransitionGroup name="toast" tag="div" class="toasts-wrapper">
      <div v-for="toast in toasts" :key="toast.id" class="Toast" @click="dismissToast(toast.id)">
        <div class="content">
          <strong class="title">{{ toast.title }}</strong>
          <span class="description">{{ toast.description }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.ToastContainer {
  position: fixed;
  bottom: max(24px, env(safe-area-inset-bottom));
  right: max(24px, env(safe-area-inset-right));
  z-index: 2;
}

.toasts-wrapper {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  align-items: flex-end;
}

.Toast {
  position: relative;
  padding: 12px 16px;
  font-size: 14px;
  text-align: left;
  color: var(--color-primary);
  background-color: rgba(var(--color-secondary-rgb), 0.6);
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 10%, transparent);
  box-shadow:
    0px 1px 1px rgba(0, 0, 0, 0.02),
    0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 8px 16px rgba(0, 0, 0, 0.06),
    inset 0 1.5px 8px 0 rgba(var(--color-primary-rgb), 0.05);
  backdrop-filter: blur(8px);
  max-width: min(calc(100vw - 48px), 480px);
  width: max-content;
  cursor: pointer;
  pointer-events: auto;
  transition: opacity 0.2s ease;

  .content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .title {
    font-weight: 500;
    opacity: 0.95;
  }

  .description {
    opacity: 0.8;
    line-height: 1.4;
    white-space: pre-wrap;
    text-wrap: pretty;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>