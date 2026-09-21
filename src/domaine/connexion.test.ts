import { describe, expect, it } from 'vitest';
import { REFUS_CONNEXION, refusDuCode } from './connexion';

describe('refusDuCode', () => {
  it('traduit les codes de la V1 en refus nommés', () => {
    expect(refusDuCode('auth/invalid-email')).toBe('adresse');
    expect(refusDuCode('auth/invalid-credential')).toBe('identifiants');
    expect(refusDuCode('auth/user-not-found')).toBe('identifiants');
    expect(refusDuCode('auth/wrong-password')).toBe('identifiants');
    expect(refusDuCode('auth/user-disabled')).toBe('compteDesactive');
    expect(refusDuCode('auth/too-many-requests')).toBe('tropDEssais');
    expect(refusDuCode('auth/network-request-failed')).toBe('reseau');
    expect(refusDuCode('auth/popup-closed-by-user')).toBe('fenetreFermee');
    expect(refusDuCode('auth/cancelled-popup-request')).toBe('fenetreFermee');
    expect(refusDuCode('auth/popup-blocked')).toBe('fenetreBloquee');
    expect(refusDuCode('auth/unauthorized-domain')).toBe('domaine');
  });

  it('tombe sur le refus générique pour un code inconnu ou vide', () => {
    expect(refusDuCode('auth/quelque-chose')).toBe('autre');
    expect(refusDuCode('')).toBe('autre');
  });

  it('ne rend que des refus de la liste', () => {
    for (const code of ['auth/invalid-email', 'auth/popup-blocked', 'x']) {
      expect(REFUS_CONNEXION).toContain(refusDuCode(code));
    }
  });
});
