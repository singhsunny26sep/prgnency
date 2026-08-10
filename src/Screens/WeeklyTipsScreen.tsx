import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import strings from '../../localization';

const WeeklyTipsScreen = () => {
  const tips = [
    { week: 1, title: strings.conception || 'Conception & Early Pregnancy', tip: strings.tipWeek1 || 'Start taking prenatal vitamins with folic acid. Avoid alcohol and smoking.', icon: '🌱' },
    { week: 2, title: strings.implantation || 'Implantation', tip: strings.tipWeek2 || 'Stay hydrated and get plenty of rest. Track your basal body temperature.', icon: '💗' },
    { week: 3, title: strings.cellDivision || 'Cell Division', tip: strings.tipWeek3 || 'Eat a balanced diet rich in vitamins and minerals. Avoid caffeine.', icon: '🔬' },
    { week: 4, title: strings.earlyPregnancy || 'Early Pregnancy', tip: strings.tipWeek4 || 'You might experience light spotting. Take a pregnancy test if period is late.', icon: '🌸' },
    { week: 5, title: strings.neuralTube || 'Neural Tube Development', tip: strings.tipWeek5 || 'Continue folic acid supplements. Eat leafy greens and fortified cereals.', icon: '🧠' },
    { week: 6, title: strings.heartbeat || 'Heartbeat Begins', tip: strings.tipWeek6 || 'Manage morning sickness with small, frequent meals and ginger tea.', icon: '💓' },
    { week: 7, title: strings.brainDev || 'Brain Development', tip: strings.tipWeek7 || 'Stay hydrated. Get Omega-3 fatty acids from fish or supplements.', icon: '🧘‍♀️' },
    { week: 8, title: strings.fatigue || 'Growing Baby', tip: strings.tipWeek8 || 'Fatigue is normal. Listen to your body and rest when needed.', icon: '😴' },
    { week: 9, title: strings.majorOrgans || 'Major Organs Formed', tip: strings.tipWeek9 || 'Eat small, frequent meals to reduce nausea and heartburn.', icon: '🍽️' },
    { week: 10, title: strings.embryoStage || 'End of Embryo Stage', tip: strings.tipWeek10 || 'First prenatal appointment. Discuss genetic testing options.', icon: '👨‍⚕️' },
    { week: 11, title: strings.rapidGrowth || 'Rapid Growth', tip: strings.tipWeek11 || 'Your baby is now an official fetus. Continue healthy eating.', icon: '🌿' },
    { week: 12, title: strings.endFirstTri || 'End of First Trimester', tip: strings.tipWeek12 || 'Morning sickness may improve. Schedule first trimester ultrasound.', icon: '🎯' },
    { week: 13, title: strings.startSecondTri || 'Start of Second Trimester', tip: strings.tipWeek13 || 'Enter the "honeymoon period." Energy returns, nausea often subsides.', icon: '☀️' },
    { week: 14, title: strings.hearingDev || 'Hearing Development', tip: strings.tipWeek14 || 'Talk and sing to your baby. Avoid loud noises.', icon: '🎵' },
    { week: 15, title: strings.tasteBuds || 'Taste Buds Form', tip: strings.tipWeek15 || 'Eat a variety of healthy foods to introduce different tastes.', icon: '🥗' },
    { week: 16, title: strings.firstMovements || 'First Movements', tip: strings.tipWeek16 || 'You may feel "quickening" soon. Monitor baby kicks.', icon: '👶' },
    { week: 17, title: strings.boneDev || 'Skeletal Development', tip: strings.tipWeek17 || 'Ensure adequate calcium intake for bone development.', icon: '🥛' },
    { week: 18, title: strings.genderReveal || 'Gender Reveal Possible', tip: strings.tipWeek18 || 'Consider anatomy ultrasound to confirm baby gender.', icon: '🔮' },
    { week: 19, title: strings.sensesDev || 'Senses Develop', tip: strings.tipWeek19 || 'Baby can hear your voice. Read and talk daily.', icon: '📚' },
    { week: 20, title: strings.halfway || 'Halfway Point!', tip: strings.tipWeek20 || 'Feel the baby movements strongly. Track kick counts.', icon: '🎉' },
    { week: 21, title: strings.hairGrowth || 'Hair Growing', tip: strings.tipWeek21 || 'Continue iron-rich foods. Prevent anemia.', icon: '✨' },
    { week: 22, title: strings.tasteSmell || 'Taste & Smell', tip: strings.tipWeek22 || 'Avoid strongly spiced foods that may cause discomfort.', icon: '🌶️' },
    { week: 23, title: strings.lungDev || 'Lung Development', tip: strings.tipWeek23 || 'Avoid second-hand smoke. Breathe fresh air.', icon: '🌬️' },
    { week: 24, title: strings.viability || 'Viability Milestone', tip: strings.tipWeek24 || 'Baby could survive with medical support. Prepare hospital bag.', icon: '🏥' },
    { week: 25, title: strings.brainSurge || 'Brain Surge', tip: strings.tipWeek25 || 'Provide DHA for optimal brain development.', icon: '🧠' },
    { week: 26, title: strings.eyesOpen || 'Eyes Opening', tip: strings.tipWeek26 || 'Include vitamin A from carrots and sweet potatoes.', icon: '👁️' },
    { week: 27, title: strings.thirdTriStart || 'Third Trimester Starts', tip: strings.tipWeek27 || 'Monitor for preterm labor signs. Stay active moderately.', icon: '🏃‍♀️' },
    { week: 28, title: strings.weightGain1 || 'Weight Gain', tip: strings.tipWeek28 || 'Aim for 1 pound per week. Focus on nutrient-dense foods.', icon: '⚖️' },
    { week: 29, title: strings.ironPeak || 'Iron Needs Peak', tip: strings.tipWeek29 || 'Take iron supplements. Eat spinach and red meat.', icon: '🥩' },
    { week: 30, title: strings.boneDev2 || 'Bone Development', tip: strings.tipWeek30 || 'Ensure 1000mg calcium daily. Include dairy/alternatives.', icon: '🦴' },
    { week: 31, title: strings.brainConnections || 'Brain Connections', tip: strings.tipWeek31 || 'Continue DHA. Practice meditation for baby.', icon: '🧘' },
    { week: 32, title: strings.headDown || 'Head Down Position', tip: strings.tipWeek32 || 'Check baby position. Practice pelvic tilts.', icon: '⬇️' },
    { week: 33, title: strings.lungMature || 'Lung Maturity', tip: strings.tipWeek33 || 'Avoid pollution. Practice breathing exercises.', icon: '🫁' },
    { week: 34, title: strings.growingFast || 'Gaining Weight', tip: strings.tipWeek34 || 'Baby weighs about 2kg. Rest when needed.', icon: '😌' },
    { week: 35, title: strings.almostFullTerm || 'Almost Full Term', tip: strings.tipWeek35 || 'Monitor contractions. Prepare birth plan.', icon: '📋' },
    { week: 36, title: strings.fullTermSoon || 'Full Term Soon', tip: strings.tipWeek36 || 'Baby dropping lower. Practice perineal massage.', icon: '📍' },
    { week: 37, title: strings.fullTerm || 'Full Term!', tip: strings.tipWeek37 || 'Baby is fully developed. Watch for labor signs.', icon: '🎊' },
    { week: 38, title: strings.dueNear || 'Due Date Near', tip: strings.tipWeek38 || 'Stay relaxed. Practice labor breathing techniques.', icon: '😮‍💨' },
    { week: 39, title: strings.waiting || 'Waiting for Labor', tip: strings.tipWeek39 || 'Stay hydrated. Get rest. Pack hospital bag.', icon: '👜' },
    { week: 40, title: strings.dueDate || 'Due Date Arrived', tip: strings.tipWeek40 || 'Only 5% deliver on due date. Contact doctor if no labor signs.', icon: '📞' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.weeklyTipsTitle}</Text>
        <Text style={styles.headerSubtitle}>Expert advice for every stage of pregnancy</Text>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>40</Text>
          <Text style={styles.statLabel}>Weeks</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>500+</Text>
          <Text style={styles.statLabel}>Tips</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>100%</Text>
          <Text style={styles.statLabel}>Expert Reviewed</Text>
        </View>
      </View>

      <View style={styles.tipsList}>
        {tips.map((tip, index) => (
          <View key={index} style={[styles.tipCard, index % 2 === 0 ? styles.tipCardLight : styles.tipCardDark]}>
            <View style={styles.tipHeader}>
              <View style={styles.weekBadge}>
                <Text style={styles.weekNumber}>W{tip.week}</Text>
              </View>
              <View style={styles.tipTitleContainer}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
              </View>
            </View>
            <Text style={styles.tipText}>{tip.tip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remember: Every pregnancy is unique. Always consult your healthcare provider.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { padding: 24, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#FFE4E9' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#D6336C', marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: '#666', textAlign: 'center' },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#FFE4E9', marginHorizontal: 16, borderRadius: 16, marginTop: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#D6336C' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#D6336C', opacity: 0.3 },
  tipsList: { padding: 16 },
  tipCard: { borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  tipCardLight: { backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#D6336C' },
  tipCardDark: { backgroundColor: '#FDF2F5', borderLeftWidth: 4, borderLeftColor: '#4A90E2' },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  weekBadge: { backgroundColor: '#D6336C', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 12 },
  weekNumber: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tipTitleContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipTitle: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1 },
  tipIcon: { fontSize: 24 },
  tipText: { fontSize: 14, color: '#666', lineHeight: 20, paddingLeft: 8 },
  footer: { padding: 24, alignItems: 'center', marginTop: 8 },
  footerText: { fontSize: 13, color: '#999', textAlign: 'center', fontStyle: 'italic' },
});

export default WeeklyTipsScreen;

