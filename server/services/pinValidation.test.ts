/**
 * Testes para validação de PIN
 * Testa a lógica de PIN sem dependências de DOM
 */

import { describe, it, expect } from 'vitest';

// Simular a lógica de validação de PIN
class PinValidator {
  private correctPin: string;
  private maxAttempts: number;
  private attempts: number = 0;
  private locked: boolean = false;

  constructor(correctPin: string, maxAttempts: number = 3) {
    this.correctPin = correctPin;
    this.maxAttempts = maxAttempts;
  }

  validatePin(input: string): { valid: boolean; error?: string; locked?: boolean } {
    // Verificar se está bloqueado
    if (this.locked) {
      return {
        valid: false,
        error: 'Muitas tentativas. Tente novamente em 5 minutos.',
        locked: true,
      };
    }

    // Validar comprimento
    if (input.length !== 4) {
      return {
        valid: false,
        error: 'PIN deve ter exatamente 4 dígitos',
      };
    }

    // Validar PIN
    if (input === this.correctPin) {
      this.attempts = 0;
      return { valid: true };
    }

    // PIN incorreto
    this.attempts++;
    if (this.attempts >= this.maxAttempts) {
      this.locked = true;
      return {
        valid: false,
        error: 'Muitas tentativas. Tente novamente em 5 minutos.',
        locked: true,
      };
    }

    return {
      valid: false,
      error: 'PIN incorreto',
    };
  }

  getAttemptsRemaining(): number {
    return Math.max(0, this.maxAttempts - this.attempts);
  }

  isLocked(): boolean {
    return this.locked;
  }

  unlock(): void {
    this.locked = false;
    this.attempts = 0;
  }

  sanitizeInput(input: string): string {
    // Remover caracteres não-numéricos
    return input.replace(/[^0-9]/g, '').slice(0, 4);
  }
}

describe('PIN Validation Logic', () => {
  describe('PIN Validation', () => {
    it('deve aceitar PIN correto', () => {
      const validator = new PinValidator('1234');
      const result = validator.validatePin('1234');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('deve rejeitar PIN incorreto', () => {
      const validator = new PinValidator('1234');
      const result = validator.validatePin('9999');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('PIN incorreto');
    });

    it('deve rejeitar PIN com menos de 4 dígitos', () => {
      const validator = new PinValidator('1234');
      const result = validator.validatePin('123');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('PIN deve ter exatamente 4 dígitos');
    });

    it('deve rejeitar PIN com mais de 4 dígitos', () => {
      const validator = new PinValidator('1234');
      const result = validator.validatePin('12345');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('PIN deve ter exatamente 4 dígitos');
    });
  });

  describe('Tentativas e Bloqueio', () => {
    it('deve contar tentativas incorretas', () => {
      const validator = new PinValidator('1234', 3);

      validator.validatePin('0000');
      expect(validator.getAttemptsRemaining()).toBe(2);

      validator.validatePin('0000');
      expect(validator.getAttemptsRemaining()).toBe(1);

      validator.validatePin('0000');
      expect(validator.getAttemptsRemaining()).toBe(0);
      expect(validator.isLocked()).toBe(true);
    });

    it('deve bloquear após máximo de tentativas', () => {
      const validator = new PinValidator('1234', 2);

      validator.validatePin('0000');
      validator.validatePin('0000');

      const result = validator.validatePin('1234');
      expect(result.valid).toBe(false);
      expect(result.locked).toBe(true);
      expect(result.error).toBe('Muitas tentativas. Tente novamente em 5 minutos.');
    });

    it('deve rejeitar PIN correto quando bloqueado', () => {
      const validator = new PinValidator('1234', 1);

      validator.validatePin('0000');
      const result = validator.validatePin('1234');

      expect(result.valid).toBe(false);
      expect(result.locked).toBe(true);
    });

    it('deve desbloquear quando chamado unlock()', () => {
      const validator = new PinValidator('1234', 1);

      validator.validatePin('0000');
      expect(validator.isLocked()).toBe(true);

      validator.unlock();
      expect(validator.isLocked()).toBe(false);
      expect(validator.getAttemptsRemaining()).toBe(1);
    });
  });

  describe('Input Sanitization', () => {
    it('deve remover caracteres não-numéricos', () => {
      const validator = new PinValidator('1234');
      const sanitized = validator.sanitizeInput('12a3b4');
      expect(sanitized).toBe('1234');
    });

    it('deve limitar a 4 dígitos', () => {
      const validator = new PinValidator('1234');
      const sanitized = validator.sanitizeInput('123456');
      expect(sanitized).toBe('1234');
    });

    it('deve aceitar entrada vazia', () => {
      const validator = new PinValidator('1234');
      const sanitized = validator.sanitizeInput('');
      expect(sanitized).toBe('');
    });

    it('deve remover símbolos especiais', () => {
      const validator = new PinValidator('1234');
      const sanitized = validator.sanitizeInput('1-2@3#4');
      expect(sanitized).toBe('1234');
    });
  });

  describe('Custom PIN', () => {
    it('deve aceitar PIN customizado', () => {
      const validator = new PinValidator('5678');
      const result = validator.validatePin('5678');
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar PIN diferente do customizado', () => {
      const validator = new PinValidator('5678');
      const result = validator.validatePin('1234');
      expect(result.valid).toBe(false);
    });
  });

  describe('Custom Max Attempts', () => {
    it('deve aceitar maxAttempts customizado', () => {
      const validator = new PinValidator('1234', 5);

      for (let i = 0; i < 4; i++) {
        validator.validatePin('0000');
      }

      expect(validator.getAttemptsRemaining()).toBe(1);
      expect(validator.isLocked()).toBe(false);

      validator.validatePin('0000');
      expect(validator.isLocked()).toBe(true);
    });
  });

  describe('Session Management', () => {
    it('deve resetar tentativas após PIN correto', () => {
      const validator = new PinValidator('1234', 3);

      validator.validatePin('0000');
      expect(validator.getAttemptsRemaining()).toBe(2);

      validator.validatePin('1234');
      expect(validator.getAttemptsRemaining()).toBe(3);
    });

    it('deve manter estado de bloqueio', () => {
      const validator = new PinValidator('1234', 1);

      validator.validatePin('0000');
      expect(validator.isLocked()).toBe(true);

      const result = validator.validatePin('1234');
      expect(result.locked).toBe(true);
    });
  });

  describe('Casos Extremos', () => {
    it('deve aceitar PIN com zeros', () => {
      const validator = new PinValidator('0000');
      const result = validator.validatePin('0000');
      expect(result.valid).toBe(true);
    });

    it('deve aceitar PIN com números altos', () => {
      const validator = new PinValidator('9999');
      const result = validator.validatePin('9999');
      expect(result.valid).toBe(true);
    });

    it('deve rejeitar entrada vazia', () => {
      const validator = new PinValidator('1234');
      const result = validator.validatePin('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('PIN deve ter exatamente 4 dígitos');
    });
  });
});
