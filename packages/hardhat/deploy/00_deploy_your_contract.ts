// Импортируем типы для работы с развертыванием контракта и среды выполнения Hardhat
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Определяем функцию развертывания контракта
const deployCopyrightRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Деструктуризация для получения объектов 'deployments' и 'getNamedAccounts' из среды выполнения
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments; // Получаем метод 'deploy' для развертывания контракта

  // Получаем аккаунты, используемые для развертывания (в частности, аккаунт деплойера)
  const { deployer } = await getNamedAccounts();

  // Разворачиваем контракт "CopyrightRegistry" от имени деплойера
  await deploy("CopyrightRegistry", {
    from: deployer, // Указываем адрес деплойера
    log: true, // Включаем логирование процесса развертывания
  });
};

// Экспортируем функцию развертывания, чтобы она могла быть использована в Hardhat
export default deployCopyrightRegistry;
