import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Container} from '../../../Components/Container/Container';
import {AllColors} from '../../../Constants/COLORS';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale, scale, verticalScale} from '../../../Constants/Scalling';
import {Fonts} from '../../../Constants/Fonts';

const faqData = [
  {
    question: 'Can Pre-Pregnant ladies attend the workshop?',
    answer:
      'Yes you can. And you should definitely attend it.The workshop is designed speciically for pregnant women. But before getting pregnant if you attend the workshop, tehre are some extra advantages. if there is some physical, mental, personal problems or defects related to fetus, it can be eradicated.The body,mind and soul are ready to attain the future child.Pregnancy retention is not just a physical phenomenon but it is also a menal and spiritual phenomenon. Gestational should be seen only in a global and divine way,not only in terms of medical and physical conditons. A mother receives a baby as she resolves sitting in the workshop. Thoes who are struggling to get children,also have to attend this workshop.',
  },
  {
    question: 'Isnt Hiranya Garbha sanskars book and App enough?',
    answer:
      'Those whi can not be attend workshop,they must complate these two courses ie.courses given in book & app.But 70% of the book is not taken in the workshop.The tracks in the app are not taken in the workshop.Book & App they are basically for home and 70% of the workshop can not be read & understand. It is important for the to be present in the wiejshop to understood.it is important for the to be preset in the workshop to understand it.It is important for the to be present in the workshop to understant it.',
  },
  {
    question: 'im a working woman, cant take holiday..What to do?',
    answer:
      'For any relaruves wedding or any programme we dont hesitate to take holiday. Then why to when your taking holiday for your unborn baby & his future. In 2 days of workshop your babys health & nature will be decided. So cant you spend 2 days for your baby. In the workshop you can join us as couple or as single also id possible do attend this workshop as couple only. if the would be dather cant come then at least babys mother should join us.',
  },

  {
    question: `Will my doctor's file or sonography report have to be bought to the workshop`,
    answer: `No!Hiranya Garbha sanskar does not recommended any medicine and no exercies is taught which may cause pressure on the fetus. Many perople have a misunderstanding that Garbha sanskar includes medical procedures and exerciese and some mantras. The medical procecures and xomes under 'Trust in yo and Your Doctors".This is an important part but is not a part of garbh sanskar. and we don't have so much time to repeat those things in workshop which are already said by doctors.There is no intervention in the doctorls treatment in the woekshop.Garbh sanskar is and independent and cery big concept. and Hiranya garbha sansakar is the largest brand in the universe today.which workshops for garbh sansakar in its original from.`,
  },
  {
    question:
      'Is it necessary to get her husband with the pregnant lady Hiranya Garbha Sanskar?',
    answer: `The actual participation in the workshop is of the mother's because the baby is in the womb of the mother.Husband does't need to sit in the workshop, but id the father is involved with his mother, there is additional benefit.(1).From the persepective of the pregnancy, the nature and lifestyle of the to be mother is changed but if he the father understands. then the participation and co-opratiion in that style also benefits him and it is understood that what is the role of a father in pregnancy. (2)Another reason us that it is important fir ri attend any pooja un pairs, by pairing in some religious rituals. (3)Thirdly, the connectivity between mother and child us created throughout the life,same connectivity is produced between the father and child ad it is for a lifetime.But id for some reason a father can not cime in the workshop,then the mother alone can complete all the sanskars.`,
  },
  {
    question:
      'Could I sit on one place for so long time & that too for 2 days?',
    answer:
      'Get rid of the non-assumption that you have to sit for two days.The workshop is designed in the from of as much relaxed you be at home, that much relaxed you all be in the workshop.Ac halls are equipped with spacious facilities,sitting in the seat below,sitting on the chair,sleeping processs in all sorts of steps.if you di not want to sit or lie diwn in process,then it is also a choice. There are some already symptoms then they also go away.Even if there is anu doubt in spite of his,you can go back refunding fess,only deducting expenses for your attended part of session.and it is special that no one has gone back till today.',
  },
  {
    question: 'Which month in pregnancy is apt to attend the workshop?',
    answer: 'You can attend the workshop in any month of your pregnancy, even if you are in your last month then also you can attend the workshop.but as early  you are is as best as it can be. if you attend the workshop in earlier phase of your pregnancy,the would be mothers lifestyle & behavior is changed according to the baby.Motherhood is introduced & felt quicly if you attend the workshop early.Likewise it is also made sure that the baby feeld no negativity near him/her.baby feeel/get protected.therefore as you get to know about the workshop dont dely & attend the frist workshop which you can.',
  },
  {
    question: 'The Workshop Venue Is Too Far?',
    answer: 'People come from across the city to attend the Hirany Garbha Sanskar workshop. Some even come from across the state & some come from out of the state.it is really appreciable taht they spend so much money & time for their baby. As this is a national lavel big budget workshop in each & every area of any city.',
  },
];

export default function FaqScreen({navigation}) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleToggle = index => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="FAQ"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.faqContainer}>
          {faqData.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqTitleContainer}
                onPress={() => handleToggle(index)}>
                <Text style={styles.faqTitle}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={AllColors.black}
                  marginRight={5}
                />
              </TouchableOpacity>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  faqContainer: {
    marginTop: 20,
  },
  faqItem: {
    borderWidth: 0.5,
    marginVertical: verticalScale(5),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(5),
  },
  faqTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqTitle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.black,
    flex: 1,
    marginLeft: scale(8),
  },
  faqAnswer: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.AfacadRegular,
    color: 'grey',
    marginTop: scale(5),
    paddingHorizontal: scale(8),
    textAlign: 'justify',
  },
});
