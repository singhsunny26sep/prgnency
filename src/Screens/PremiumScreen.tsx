import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';

type PremiumScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Premium'>;

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  color: string;
  popular?: boolean;
  modules: string[];
  exclusive?: string[];
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: strings.basicPackage || 'BASIC PACKAGE',
    price: '1,999',
    period: '/' + (strings.threeMonths || '3 Months'),
    color: '#8B5CF6',
    modules: [
      strings.introductionToHiranyagarbha || 'Introduction to Hiranyagarbha',
      strings.pregnancyMonthwiseBabyDevelopment || 'Pregnancy Month-wise Baby Development',
      strings.healthyPregnancyLifestyle || 'Healthy Pregnancy Lifestyle',
      strings.nutritionDietBasics || 'Nutrition & Diet Basics',
      strings.pregnancyYogaBeginner || 'Pregnancy Yoga (Beginner)',
      strings.breathingRelaxation || 'Breathing & Relaxation',
      strings.meditationForMotherBaby || 'Meditation for Mother & Baby',
      strings.garbhaSamvad || 'Garbha Samvad (Talking to Baby)',
      strings.positiveAffirmations || 'Positive Affirmations',
      strings.musicTherapy || 'Music Therapy',
      strings.emotionalWellness || 'Emotional Wellness',
      strings.husbandsRoleInPregnancy || "Husband's Role in Pregnancy",
    ],
    includes: [
      strings.twelveRecordedVideoModules || '12 Recorded Video Modules',
      strings.weeklyLiveSession || 'Weekly Live Session',
      strings.dietCharts || 'Diet Charts',
      strings.dailyAffirmations || 'Daily Affirmations',
      strings.mobileAppAccess || 'Mobile App Access',
      strings.whatsappSupport || 'WhatsApp Support',
      strings.pregnancyJournalDigital || 'Pregnancy Journal (Digital)',
    ],
  },
  {
    id: 'pro',
    name: strings.proPackage || 'PRO PACKAGE',
    price: '3,999',
    period: '/' + (strings.entirePregnancy || 'Entire Pregnancy'),
    color: '#EC4899',
    popular: true,
    modules: [
      strings.trimesterwiseMasterclasses || 'Trimester-wise Masterclasses',
      strings.advancedPregnancyYoga || 'Advanced Pregnancy Yoga',
      strings.ayurvedicPregnancyCare || 'Ayurvedic Pregnancy Care',
      strings.stressAnxietyManagement || 'Stress & Anxiety Management',
      strings.coupleBondingSessions || 'Couple Bonding Sessions',
      strings.fetalBrainDevelopment || 'Fetal Brain Development Activities',
      strings.sanskritMantras || 'Sanskrit Mantras & Meaning',
      strings.mindfulnessVisualization || 'Mindfulness & Visualization',
      strings.garbhaMeditationSeries || 'Garbha Meditation Series',
      strings.labourPreparation || 'Labour Preparation',
      strings.breastfeedingPreparation || 'Breastfeeding Preparation',
      strings.newbornCareBasics || 'Newborn Care Basics',
      strings.parentingPsychology || 'Parenting Psychology',
      strings.familyCounselling || 'Family Counselling',
      strings.nutritionMasterclass || 'Nutrition Masterclass',
    ],
    exclusive: [
      strings.weeklyLiveQnA || 'Weekly Live Q&A',
      strings.monthlyDoctorConsultation || 'Monthly Doctor Consultation',
      strings.dieticianConsultation || 'Dietician Consultation',
      strings.personalizedPregnancyTracker || 'Personalized Pregnancy Tracker',
      strings.monthlyBabyGrowthReport || 'Monthly Baby Growth Report',
      strings.exclusiveCommunity || 'Exclusive Community',
    ],
  },
  {
    id: 'elite',
    name: strings.elitePackage || 'ELITE PACKAGE',
    price: '7,999',
    period: '/' + (strings.entirePregnancy || 'Entire Pregnancy'),
    color: '#F59E0B',
    modules: [
      strings.personalizedObstetricConsultation || 'Personalized Obstetric Consultation',
      strings.nutritionReview || 'Nutrition Review',
      strings.physiotherapyGuidance || 'Physiotherapy Guidance',
      strings.mentalWellnessCounselling || 'Mental Wellness Counselling',
      strings.highRiskPregnancyGuidance || 'High-Risk Pregnancy Guidance',
    ],
    includes: [
      strings.chakraHealingMeditation || 'Chakra Healing Meditation',
      strings.soundHealing || 'Sound Healing',
      strings.advancedYoga || 'Advanced Yoga',
      strings.coupleMeditation || 'Couple Meditation',
      strings.parentingCoaching || 'Parenting Coaching',
    ],
    exclusive: [
      strings.birthPlanCreation || 'Birth Plan Creation',
      strings.normalDeliveryPreparation || 'Normal Delivery Preparation',
      strings.labourBreathingWorkshop || 'Labour Breathing Workshop',
      strings.hospitalBagChecklist || 'Hospital Bag Checklist',
      strings.emergencyPreparedness || 'Emergency Preparedness',
    ],
    premium: [
      strings.breastfeedingCoaching || 'Breastfeeding Coaching',
      strings.postpartumRecovery || 'Postpartum Recovery',
      strings.babyMassageGuidance || 'Baby Massage Guidance',
      strings.infantDevelopment || 'Infant Development (0-6 Months)',
      strings.parentingMasterclass || 'Parenting Masterclass',
      strings.mothersMentalHealth || "Mother's Mental Health",
    ],
  },
];

const PremiumScreen = () => {
  const navigation = useNavigation<PremiumScreenNavigationProp>();

  const renderPlan = (plan: Plan) => (
    <View
      key={plan.id}
      style={[
        styles.planCard,
        plan.popular && styles.planCardPopular,
      ]}
    >
      {plan.popular && (
        <View style={styles.popularBadgeContainer}>
          <Text style={styles.popularBadgeText}>
            {strings.mostPopular || 'Most Popular'}
          </Text>
        </View>
      )}
      <LinearGradient
        colors={[plan.color, plan.color + 'CC']}
        style={styles.planHeader}
      >
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.currency}>₹</Text>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>{plan.period}</Text>
        </View>
      </LinearGradient>

      <View style={styles.planContent}>
        {(plan.modules || []).map((module, index) => (
          <View key={index} style={styles.moduleItem}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.moduleText}>{module}</Text>
          </View>
        ))}

        {(plan.includes || []).map((item, index) => (
          <View key={`inc-${index}`} style={styles.moduleItem}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.moduleText}>{item}</Text>
          </View>
        ))}

        {(plan.exclusive || []).map((item, index) => (
          <View key={`exc-${index}`} style={styles.exclusiveItem}>
            <Text style={styles.exclusiveMark}>★</Text>
            <Text style={styles.exclusiveText}>{item}</Text>
          </View>
        ))}

        {(plan.premium || []).map((item, index) => (
          <View key={`prem-${index}`} style={styles.premiumItem}>
            <Text style={styles.premiumMark}>★</Text>
            <Text style={styles.premiumText}>{item}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.subscribeButton}>
          <LinearGradient
            colors={[plan.color, plan.color + 'DD']}
            style={styles.buttonGradient}
          >
            <Text style={styles.subscribeButtonText}>
              {strings.subscribeNow || 'Subscribe Now'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D6336C', '#F06292', '#F8B4C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.premium || 'Premium'}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            {strings.unlockPower || 'Unlock the Power of'} {' '}
            <Text style={styles.heroHighlight}>HiranyaGarbha</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            {strings.heroSubtitle || 'Give your unborn child the best start in life with our comprehensive Garbh Sanskar program'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{strings.choosePlan || 'Choose Your Plan'}</Text>

        {plans.map((plan) => renderPlan(plan))}

        <View style={styles.guaranteeSection}>
          <Text style={styles.guaranteeText}>
            {strings.guaranteeText || '7-Day Money Back Guarantee • Cancel Anytime • Secure Payment'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  heroTitle: {
    fontSize: 22,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroHighlight: {
    color: '#D6336C',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  planCardPopular: {
    borderWidth: 2,
    borderColor: '#EC4899',
  },
  popularBadgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EC4899',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomLeftRadius: 16,
    zIndex: 1,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    padding: 24,
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 20,
    color: '#FFFFFF',
    opacity: 0.8,
    marginRight: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  period: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginLeft: 4,
    marginBottom: 4,
  },
  planContent: {
    padding: 20,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkMark: {
    color: '#10B981',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  moduleText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  exclusiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  exclusiveMark: {
    color: '#8B5CF6',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  exclusiveText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  premiumItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  premiumMark: {
    color: '#F59E0B',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  premiumText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  subscribeButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  guaranteeSection: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  guaranteeText: {
    fontSize: 13,
    color: '#2E7D32',
    textAlign: 'center',
  },
});

export default PremiumScreen;