'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, X, Bell, Mail, Globe, Palette } from 'lucide-react';
import { UserPreferences } from '@/types/user';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: Partial<UserPreferences>) => void;
  onClose: () => void;
}

const languages = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

const currencies = [
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'COP', label: 'COP - Peso Colombiano' },
];

const themes = [
  { value: 'light', label: 'Claro', icon: Palette },
  { value: 'dark', label: 'Oscuro', icon: Palette },
  { value: 'system', label: 'Sistema', icon: Palette },
];

export default function PreferencesForm({
  preferences,
  onSave,
  onClose,
}: PreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(preferences);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (
    type: 'email' | 'push',
    field: string,
    value: boolean,
  ) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Notifications`]: {
        ...prev[`${type}Notifications`],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Preferencias de Usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configuración General */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Configuración General</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={formData.language}
                  onValueChange={value => handleInputChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={value => handleInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  value={formData.theme}
                  onValueChange={value => handleInputChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notificaciones por Email */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                Notificaciones por Email
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Actualizaciones de pedidos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe notificaciones sobre el estado de tus pedidos
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications.orderUpdates}
                  onChange={e =>
                    handleNotificationChange(
                      'email',
                      'orderUpdates',
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Promociones y ofertas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe ofertas especiales y descuentos
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications.promotions}
                  onChange={e =>
                    handleNotificationChange(
                      'email',
                      'promotions',
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Boletín informativo
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe noticias y actualizaciones de la tienda
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications.newsletter}
                  onChange={e =>
                    handleNotificationChange(
                      'email',
                      'newsletter',
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Alertas de seguridad
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notificaciones importantes sobre tu cuenta
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications.securityAlerts}
                  onChange={e =>
                    handleNotificationChange(
                      'email',
                      'securityAlerts',
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notificaciones Push */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Notificaciones Push</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Actualizaciones de pedidos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe notificaciones push sobre el estado de tus pedidos
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.pushNotifications.orderUpdates}
                  onChange={e =>
                    handleNotificationChange(
                      'push',
                      'orderUpdates',
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Promociones y ofertas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe ofertas especiales como notificaciones push
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.pushNotifications.promotions}
                  onChange={e =>
                    handleNotificationChange(
                      'push',
                      'promotions',
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">
                    Alertas de seguridad
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notificaciones push importantes sobre tu cuenta
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.pushNotifications.securityAlerts}
                  onChange={e =>
                    handleNotificationChange(
                      'push',
                      'securityAlerts',
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Preferencias'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
