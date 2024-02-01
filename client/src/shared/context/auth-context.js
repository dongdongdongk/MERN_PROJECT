import { createContext } from "react";

// AuthContext라는 새로운 컨텍스트를 생성합니다.
export const AuthContext = createContext({ 
  // 컨텍스트의 초기값을 설정합니다.
  isLoggedIn: false,  // 사용자의 로그인 상태를 나타냅니다. 초기값은 false로 설정되어 있습니다.
  userId: null,       // 현재 로그인한 사용자의 ID를 나타냅니다. 초기값은 null로 설정되어 있습니다.
  token : null,
  login: () => {},    // 로그인 함수를 빈 함수로 설정합니다. 실제 구현은 컨텍스트를 사용하는 컴포넌트에서 이뤄집니다.
  logout: () => {}    // 로그아웃 함수를 빈 함수로 설정합니다. 실제 구현은 컨텍스트를 사용하는 컴포넌트에서 이뤄집니다.
});