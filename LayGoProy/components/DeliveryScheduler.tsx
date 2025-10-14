import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../constants/theme';

interface DeliverySchedule {
  id: string;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
}

interface DeliverySchedulerProps {
  visible: boolean;
  onClose: () => void;
  onSchedule: (schedule: DeliverySchedule) => void;
  existingSchedule?: DeliverySchedule;
}

const timeSlots = [
  { id: 'morning', label: 'Mañana (8:00 - 12:00)', icon: '🌅' },
  { id: 'afternoon', label: 'Tarde (12:00 - 17:00)', icon: '☀️' },
  { id: 'evening', label: 'Noche (17:00 - 20:00)', icon: '🌆' },
];

const deliveryAreas = [
  { id: 'lima-centro', name: 'Lima Centro', fee: 0 },
  { id: 'lima-norte', name: 'Lima Norte', fee: 5 },
  { id: 'lima-sur', name: 'Lima Sur', fee: 5 },
  { id: 'lima-este', name: 'Lima Este', fee: 8 },
  { id: 'callao', name: 'Callao', fee: 3 },
  { id: 'provincias', name: 'Provincias', fee: 15 },
];

export default function DeliveryScheduler({
  visible,
  onClose,
  onSchedule,
  existingSchedule,
}: DeliverySchedulerProps) {
  const [selectedDate, setSelectedDate] = useState(
    existingSchedule?.date || new Date().toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    existingSchedule?.timeSlot || ''
  );
  const [selectedArea, setSelectedArea] = useState('');
  const [address, setAddress] = useState(existingSchedule?.address || '');
  const [notes, setNotes] = useState(existingSchedule?.notes || '');
  const [step, setStep] = useState(1);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (step === 1 && !selectedDate) {
      Alert.alert('Error', 'Por favor selecciona una fecha');
      return;
    }
    if (step === 2 && !selectedTimeSlot) {
      Alert.alert('Error', 'Por favor selecciona un horario');
      return;
    }
    if (step === 3 && !selectedArea) {
      Alert.alert('Error', 'Por favor selecciona una zona de entrega');
      return;
    }
    if (step === 4 && !address.trim()) {
      Alert.alert('Error', 'Por favor ingresa la dirección de entrega');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    const selectedAreaData = deliveryAreas.find(area => area.id === selectedArea);
    const selectedTimeData = timeSlots.find(slot => slot.id === selectedTimeSlot);
    
    if (!selectedAreaData || !selectedTimeData) {
      Alert.alert('Error', 'Información incompleta');
      return;
    }

    const schedule: DeliverySchedule = {
      id: existingSchedule?.id || Date.now().toString(),
      date: selectedDate,
      timeSlot: selectedTimeData.label,
      address: address.trim(),
      notes: notes.trim() || undefined,
    };

    onSchedule(schedule);
    onClose();
    
    // Reset form
    setStep(1);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedTimeSlot('');
    setSelectedArea('');
    setAddress('');
    setNotes('');
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona la Fecha</Text>
      <Text style={styles.stepDescription}>
        Elige cuándo quieres recibir tu pedido
      </Text>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Fecha de entrega:</Text>
        <TextInput
          style={styles.dateInput}
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="YYYY-MM-DD"
          keyboardType="numeric"
        />
        <Text style={styles.dateNote}>
          * Mínimo 24 horas de anticipación
        </Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona el Horario</Text>
      <Text style={styles.stepDescription}>
        Elige tu horario preferido de entrega
      </Text>
      
      <View style={styles.timeSlotsContainer}>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles.timeSlotButton,
              selectedTimeSlot === slot.id && styles.timeSlotButtonActive
            ]}
            onPress={() => setSelectedTimeSlot(slot.id)}
          >
            <Text style={styles.timeSlotIcon}>{slot.icon}</Text>
            <Text style={[
              styles.timeSlotText,
              selectedTimeSlot === slot.id && styles.timeSlotTextActive
            ]}>
              {slot.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona la Zona</Text>
      <Text style={styles.stepDescription}>
        Elige tu zona de entrega para calcular el costo
      </Text>
      
      <View style={styles.areasContainer}>
        {deliveryAreas.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={[
              styles.areaButton,
              selectedArea === area.id && styles.areaButtonActive
            ]}
            onPress={() => setSelectedArea(area.id)}
          >
            <View style={styles.areaInfo}>
              <Text style={[
                styles.areaName,
                selectedArea === area.id && styles.areaNameActive
              ]}>
                {area.name}
              </Text>
              <Text style={[
                styles.areaFee,
                selectedArea === area.id && styles.areaFeeActive
              ]}>
                {area.fee === 0 ? 'Gratis' : `+S/ ${area.fee}`}
              </Text>
            </View>
            {selectedArea === area.id && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.light.background} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Dirección de Entrega</Text>
      <Text style={styles.stepDescription}>
        Ingresa la dirección completa donde quieres recibir tu pedido
      </Text>
      
      <View style={styles.addressContainer}>
        <Text style={styles.inputLabel}>Dirección completa:</Text>
        <TextInput
          style={styles.addressInput}
          value={address}
          onChangeText={setAddress}
          placeholder="Ej: Av. Arequipa 123, Miraflores, Lima"
          multiline
          numberOfLines={3}
        />
        
        <Text style={styles.inputLabel}>Notas adicionales (opcional):</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Instrucciones especiales para la entrega..."
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );

  const renderStep5 = () => {
    const selectedAreaData = deliveryAreas.find(area => area.id === selectedArea);
    const selectedTimeData = timeSlots.find(slot => slot.id === selectedTimeSlot);
    
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Confirmar Entrega</Text>
        <Text style={styles.stepDescription}>
          Revisa los detalles de tu entrega programada
        </Text>
        
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationItem}>
            <Ionicons name="calendar" size={20} color={Colors.light.primary} />
            <View style={styles.confirmationText}>
              <Text style={styles.confirmationLabel}>Fecha:</Text>
              <Text style={styles.confirmationValue}>
                {new Date(selectedDate).toLocaleDateString('es-PE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.confirmationItem}>
            <Ionicons name="time" size={20} color={Colors.light.primary} />
            <View style={styles.confirmationText}>
              <Text style={styles.confirmationLabel}>Horario:</Text>
              <Text style={styles.confirmationValue}>
                {selectedTimeData?.label}
              </Text>
            </View>
          </View>
          
          <View style={styles.confirmationItem}>
            <Ionicons name="location" size={20} color={Colors.light.primary} />
            <View style={styles.confirmationText}>
              <Text style={styles.confirmationLabel}>Zona:</Text>
              <Text style={styles.confirmationValue}>
                {selectedAreaData?.name} {selectedAreaData?.fee === 0 ? '(Gratis)' : `(+S/ ${selectedAreaData?.fee})`}
              </Text>
            </View>
          </View>
          
          <View style={styles.confirmationItem}>
            <Ionicons name="home" size={20} color={Colors.light.primary} />
            <View style={styles.confirmationText}>
              <Text style={styles.confirmationLabel}>Dirección:</Text>
              <Text style={styles.confirmationValue}>{address}</Text>
            </View>
          </View>
          
          {notes && (
            <View style={styles.confirmationItem}>
              <Ionicons name="document-text" size={20} color={Colors.light.primary} />
              <View style={styles.confirmationText}>
                <Text style={styles.confirmationLabel}>Notas:</Text>
                <Text style={styles.confirmationValue}>{notes}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Programar Entrega</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepIndicatorText}>{step}/5</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {renderCurrentStep()}
        </ScrollView>

        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
              <Ionicons name="chevron-back" size={20} color={Colors.light.primary} />
              <Text style={styles.previousButtonText}>Anterior</Text>
            </TouchableOpacity>
          )}
          
          {step < 5 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Siguiente</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.background} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Ionicons name="checkmark" size={20} color={Colors.light.background} />
              <Text style={styles.confirmButtonText}>Confirmar Entrega</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.light.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  stepIndicator: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  stepIndicatorText: {
    color: Colors.light.background,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  dateContainer: {
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  dateLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  dateNote: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  timeSlotsContainer: {
    gap: Spacing.sm,
  },
  timeSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.sm,
  },
  timeSlotButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  timeSlotIcon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.md,
  },
  timeSlotText: {
    fontSize: FontSizes.md,
    color: Colors.light.text,
    fontWeight: '500',
  },
  timeSlotTextActive: {
    color: Colors.light.background,
  },
  areasContainer: {
    gap: Spacing.sm,
  },
  areaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.sm,
  },
  areaButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  areaNameActive: {
    color: Colors.light.background,
  },
  areaFee: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  areaFeeActive: {
    color: Colors.light.accent,
  },
  addressContainer: {
    gap: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.light.text,
    textAlignVertical: 'top',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.light.text,
    textAlignVertical: 'top',
  },
  confirmationContainer: {
    backgroundColor: Colors.light.backgroundCard,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  confirmationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  confirmationText: {
    flex: 1,
  },
  confirmationLabel: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  confirmationValue: {
    fontSize: FontSizes.md,
    color: Colors.light.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.light.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Spacing.sm,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    gap: Spacing.xs,
  },
  previousButtonText: {
    color: Colors.light.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  nextButtonText: {
    color: Colors.light.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  confirmButtonText: {
    color: Colors.light.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
