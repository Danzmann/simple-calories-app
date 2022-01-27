import React from 'react'
import styled from "styled-components"

const StyledHeader = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`

const Title = ({ children }: { children: React.ReactNode }) => (
  <StyledHeader>
    {children}
  </StyledHeader>
)

export default Title