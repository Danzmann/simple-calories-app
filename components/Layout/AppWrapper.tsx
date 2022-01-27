import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  margin: auto;
  
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <Container>
    {children}
  </Container>
)

export default AppWrapper