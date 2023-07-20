import React, { useState } from 'react'

import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  Center,
  Actionsheet,
  useDisclose,
  Pressable,
  Icon,
  Link,
  VStack,
  ScrollView,
  Avatar,
  ZStack,
  InputGroup,
  InputRightAddon
} from 'native-base'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import * as ImagePicker from 'expo-image-picker'
import ActiveController from '../../controller/Active'
import { auth } from '../../config'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'

export function RegisterScreen () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState()
  const [confirm, setConfirm] = useState()
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [registerData, setRegisterData] = useState({})
  const [avatar, setAvatar] = useState()
  const [msg, setMsg] = useState()
  const { isOpen, onOpen, onClose } = useDisclose()

  const localizeMsg = {
    'auth/email-already-in-use': '此信箱已註冊',
    'auth/invalid-email': '電子郵件無效'
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2
    })

    if (!result.assets[0].canceled) {
      setAvatar(result.assets[0].uri)
      if (avatar === undefined) {
        setAvatar(result.assets[0].uri)
        setRegisterData({ ...registerData, avatar: result.assets[0].uri })
      }
    }
  }

  const register = () => {
    if (Object.values(registerData).length < 6) {
      setMsg('請填寫完整')
      return
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential
        ActiveController.addUser(user.uid, registerData)
      })
      .catch((err) => {
        setMsg(localizeMsg[err.code])
      })
  }

  return (
    <Center safeArea>
      <Button
        backgroundColor={'#E5EBF1'}
        w={'100%'}
        marginY={'10px'}
        isExternal
        _text={{ fontSize: 'lg', fontWeight: 'bold', color: '#000000' }}
        onPress={onOpen}
      >
        註冊
      </Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <VStack w={'100%'} h={'100%'} marginX={10}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Box
                flex={7}
                px={5}
                pb={10}
                alignItems="flex-start"
                justifyContent={'center'}
              >
                <Heading my={'20px'}>註冊帳號</Heading>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    姓名<Text color="red.600">*</Text>
                  </Heading>
                  <Input
                    w={'95%'}
                    size="md"
                    py={2}
                    alignSelf={'center'}
                    placeholder="請輸入本名 Please Enter Your Real Name"
                    wx="100%"
                    onChangeText={(name) =>
                      setRegisterData({ ...registerData, name })
                    }
                  />
                </Box>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    科系<Text color="red.600">*</Text>
                  </Heading>
                  <Input
                    w={'95%'}
                    size="md"
                    py={2}
                    alignSelf={'center'}
                    placeholder="eg. 中國語文學系 Your major"
                    wx="100%"
                    onChangeText={(major) =>
                      setRegisterData({ ...registerData, major })
                    }
                  />
                </Box>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    年級<Text color="red.600">*</Text>
                  </Heading>
                  <Input
                    w={'95%'}
                    size="md"
                    py={2}
                    alignSelf={'center'}
                    placeholder="eg. 大三 Junior"
                    wx="100%"
                    onChangeText={(grade) =>
                      setRegisterData({ ...registerData, grade })
                    }
                  />
                </Box>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    學號<Text color="red.600">*</Text>
                  </Heading>
                  <Input
                    w={'95%'}
                    size="md"
                    py={2}
                    alignSelf={'center'}
                    keyboardType="numeric"
                    placeholder="StudentID"
                    wx="100%"
                    onChangeText={(id) =>
                      setRegisterData({ ...registerData, studentID: id })
                    }
                  />
                </Box>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    電話<Text color="red.600">*</Text>
                  </Heading>
                  <Input
                    w={'95%'}
                    size="md"
                    py={2}
                    alignSelf={'center'}
                    keyboardType="numeric"
                    placeholder="Phone Number"
                    wx="100%"
                    onChangeText={(phone) =>
                      setRegisterData({ ...registerData, phone })
                    }
                  />
                </Box>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    Portal帳號<Text color="red.600">*</Text>
                  </Heading>
                  <InputGroup w={{ base: '95%' }}>
                    <Input
                      w={{ base: '65%' }} size="md"
                      py={2}
                      alignSelf={'center'}
                      placeholder="Your studentID"
                      wx="100%"
                      onChangeText={(text) => {
                        setEmail(text + '@cc.ncu.edu.tw')
                        setRegisterData({ ...registerData, email: text + '@cc.ncu.edu.tw' })
                      }}
                    />
                    <InputRightAddon w={'35%'} py={2}>
                      @cc.ncu.edu.tw
                    </InputRightAddon>
                  </InputGroup>
                </Box>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    設定密碼<Text color="red.600">*</Text>
                  </Heading>
                  <Input
                    w={'95%'}
                    size="md"
                    py={2}
                    placeholder="至少六位"
                    wx="100%"
                    alignSelf={'center'}
                    onChangeText={(text) => setPassword(text)}
                    type={showPwd ? 'text' : 'password'}
                    InputRightElement={
                      <Pressable onPress={() => setShowPwd(!showPwd)}>
                        <Icon
                          as={
                            <MaterialIcons
                              name={showPwd ? 'visibility' : 'visibility-off'}
                            />
                          }
                          size={6}
                          mr="2"
                          color="muted.500"
                        />
                      </Pressable>
                    }
                  />
                </Box>
                <Box my={3}>
                  <Heading size={'sm'} mb={2}>
                    確認密碼<Text color="red.600">*</Text>
                  </Heading>
                  <Input
                    w={'95%'}
                    size="md"
                    py={2}
                    alignSelf={'center'}
                    type={showPwd2 ? 'text' : 'password'}
                    placeholder="再次輸入密碼"
                    wx="100%"
                    onChangeText={(text) => setConfirm(text)}
                    InputRightElement={
                      <Pressable onPress={() => setShowPwd2(!showPwd2)}>
                        <Icon
                          as={
                            <MaterialIcons
                              name={showPwd2 ? 'visibility' : 'visibility-off'}
                            />
                          }
                          size={6}
                          mr="2"
                          color="muted.500"
                        />
                      </Pressable>
                    }
                  />
                </Box>
                {password && confirm && password !== confirm && (
                  <Text color={'error.600'} mt="2px">
                    密碼不相符，請再次做確認
                  </Text>
                )}

                <Link
                  onPress={() => {
                    onClose()
                  }}
                  alignSelf={'flex-start'}
                  _text={{
                    fontSize: '16',
                    color: '#737373'
                  }}
                >
                  已有帳號
                </Link>

                <Text color={'red.500'}>{ msg }</Text>

                <Box my={8}>
                  <Heading size={'sm'} mb={2}>
                    新增頭貼<Text color="red.600">*</Text>
                  </Heading>
                  <Pressable onPress={pickImage}>
                    <ZStack alignItems={'flex-end'} size={120} marginLeft={4}>
                      <Avatar
                        backgroundColor={'primary.100'}
                        w={'100%'}
                        h={'100%'}
                        source={{ uri: avatar }}
                      />
                      <AntDesign style={{
                        transform: [{ translateY: 90 }]
                      }} name="pluscircle" size={24} color='#28527A' />
                    </ZStack>
                  </Pressable>
                </Box>

                {!email ||
                !password ||
                !confirm ||
                password !== confirm ||
                !avatar ||
                !registerData.email ||
                !registerData.grade ||
                !registerData.name ||
                !registerData.major ||
                !registerData.phone ||
                !registerData.studentID
                  ? (
                  <Button
                    width={'100%'}
                    borderRadius={12}
                    alignSelf={'center'}
                    backgroundColor={'#D4D4D4'}
                    isExternal
                    _text={{
                      fontSize: 'lg',
                      fontWeight: 'bold',
                      color: '#28537A'
                    }}
                  >
                    完成
                  </Button>
                    )
                  : (
                  <Button
                    width={'100%'}
                    borderRadius={12}
                    alignSelf={'center'}
                    backgroundColor="primary.600"
                    isExternal
                    onPress={register}
                    _text={{
                      fontSize: 'lg',
                      fontWeight: 'bold',
                      color: '#fbeeac'
                    }}
                  >
                    完成
                  </Button>
                    )}
              </Box>
            </ScrollView>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </Center>
  )
}
